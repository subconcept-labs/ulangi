/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import {
  Definition,
  Vocabulary,
  VocabularyCategory,
  VocabularyWriting,
} from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';
import * as moment from 'moment';

import { VocabularyRowConverter } from '../converters/VocabularyRowConverter';
import { TableName } from '../enums/TableName';
import {
  VocabularyRow,
  VocabularyRowForInsert,
} from '../interfaces/VocabularyRow';
import { VocabularyRowPreparer } from '../preparers/VocabularyRowPreparer';
import { VocabularyRowResolver } from '../resolvers/VocabularyRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';
import { DefinitionModel } from './DefinitionModel';
import { VocabularyCategoryModel } from './VocabularyCategoryModel';
import { VocabularyWritingModel } from './VocabularyWritingModel';

export class VocabularyModel {
  private vocabularyRowResolver = new VocabularyRowResolver();
  private vocabularyRowPreparer = new VocabularyRowPreparer();
  private vocabularyRowConverter = new VocabularyRowConverter();

  private definitionModel: DefinitionModel;
  private vocabularyCategoryModel: VocabularyCategoryModel;
  private vocabularyWritingModel: VocabularyWritingModel;

  public constructor(
    definitionModel: DefinitionModel,
    vocabularyCategoryModel: VocabularyCategoryModel,
    vocabularyWritingModel: VocabularyWritingModel
  ) {
    this.definitionModel = definitionModel;
    this.vocabularyCategoryModel = vocabularyCategoryModel;
    this.vocabularyWritingModel = vocabularyWritingModel;
  }

  public getVocabularyByIds(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
    vocabularyIdSetIdPairs: readonly [string, string][];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.VOCABULARY)
              .where('userId', userId)
              .whereIn('vocabularyId', vocabularyIds.slice())
          );

          const vocabularyRows = this.vocabularyRowResolver.resolveArray(
            result,
            stripUnknown
          );

          const { vocabularyList } = await this.getCompleteVocabularyByRows(
            db,
            userId,
            vocabularyRows,
            stripUnknown
          );

          const vocabularyIdSetIdPairs = vocabularyRows.map(
            (vocabularyRow): [string, string] => {
              return [vocabularyRow.vocabularyId, vocabularyRow.setId];
            }
          );

          resolve({ vocabularyList, vocabularyIdSetIdPairs });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getVocabularyListByLastSyncTime(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    softLimit: number,
    startAt: undefined | Date,
    setId: undefined | string,
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
    vocabularyIdSetIdPairs: readonly [string, string][];
    noMore: boolean;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          // fetch vocabulary at startAt time
          let firstQueryBuilder = db
            .select()
            .from(TableName.VOCABULARY)
            .where('userId', userId)
            .where(
              'lastSyncedAt',
              '=',
              typeof startAt === 'undefined' ? moment.unix(0).toDate() : startAt
            );
          if (typeof setId !== 'undefined') {
            firstQueryBuilder = firstQueryBuilder.where('setId', setId);
          }
          firstQueryBuilder = firstQueryBuilder.orderBy('lastSyncedAt', 'asc');

          // fetch vocabulary with start from startAt time
          let secondQueryBuilder = db
            .select()
            .from(TableName.VOCABULARY)
            .where('userId', userId)
            .where(
              'lastSyncedAt',
              '>',
              typeof startAt === 'undefined' ? moment.unix(0).toDate() : startAt
            );
          if (typeof setId !== 'undefined') {
            secondQueryBuilder = secondQueryBuilder.where('setId', setId);
          }
          secondQueryBuilder = secondQueryBuilder
            .orderBy('lastSyncedAt', 'asc')
            .limit(softLimit);

          const firstQuery = promisifyQuery(firstQueryBuilder);
          const secondQuery = promisifyQuery(secondQueryBuilder);

          const [firstResultSet, secondResultSet] = await Promise.all([
            firstQuery,
            secondQuery,
          ]);

          const noMore = secondResultSet.length === 0;

          const result = _.union(firstResultSet, secondResultSet);

          const vocabularyRows = this.vocabularyRowResolver.resolveArray(
            result,
            stripUnknown
          );

          const { vocabularyList } = await this.getCompleteVocabularyByRows(
            db,
            userId,
            vocabularyRows,
            stripUnknown
          );

          const vocabularyIdSetIdPairs = vocabularyRows.map(
            (vocabularyRow): [string, string] => {
              return [vocabularyRow.vocabularyId, vocabularyRow.setId];
            }
          );

          resolve({ vocabularyList, vocabularyIdSetIdPairs, noMore });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getLatestSyncTime(
    db: knex | knex.Transaction,
    userId: string
  ): Promise<Date | null> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .max('lastSyncedAt AS latestSyncTime')
              .from(TableName.VOCABULARY)
              .where('userId', userId)
          );

          if (result.length === 1) {
            const latestSyncTime = result[0]['latestSyncTime'];
            resolve(latestSyncTime);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertMultipleVocabulary(
    db: knex.Transaction,
    userId: string,
    vocabularySetIdPairs: readonly [
      DeepPartial<Vocabulary>,
      undefined | string
    ][]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void[] | void>[] = [];

          // Insert vocabulary queries
          queries.push(
            this.insertOrIgnoreMultipleVocabulary(
              db,
              userId,
              vocabularySetIdPairs.filter(
                (pair): pair is [Vocabulary, string] => {
                  const [vocabulary, setId] = pair;
                  return this.vocabularyRowPreparer.canPrepareInsert(
                    userId,
                    vocabulary,
                    setId
                  );
                }
              )
            )
          );

          // Update vocabulary queries
          queries.push(
            this.updateMultipleVocabulary(db, userId, vocabularySetIdPairs)
          );

          // Upsert definition queries
          queries.push(
            this.definitionModel.upsertDefinitions(
              db,
              userId,
              _.flatMap(
                vocabularySetIdPairs,
                ([vocabulary]): [
                  DeepPartial<Definition>,
                  undefined | string
                ][] => {
                  return typeof vocabulary.definitions !== 'undefined'
                    ? vocabulary.definitions.map(
                        (
                          definition
                        ): [DeepPartial<Definition>, undefined | string] => [
                          definition,
                          vocabulary.vocabularyId,
                        ]
                      )
                    : [];
                }
              )
            )
          );

          // Upsert vocabulary category queries
          queries.push(
            this.vocabularyCategoryModel.upsertVocabularyCategories(
              db,
              userId,
              vocabularySetIdPairs
                .map(
                  ([vocabulary]): [
                    undefined | DeepPartial<VocabularyCategory>,
                    string
                  ] => [
                    vocabulary.category,
                    assertExists(vocabulary.vocabularyId),
                  ]
                )
                .filter(
                  (pair): pair is [DeepPartial<VocabularyCategory>, string] =>
                    typeof pair[0] !== 'undefined'
                )
            )
          );

          // Upsert vocabulary writing queries
          queries.push(
            this.vocabularyWritingModel.upsertVocabularyWritings(
              db,
              userId,
              vocabularySetIdPairs
                .map(
                  ([vocabulary]): [
                    undefined | DeepPartial<VocabularyWriting>,
                    string
                  ] => [
                    vocabulary.writing,
                    assertExists(vocabulary.vocabularyId),
                  ]
                )
                .filter(
                  (pair): pair is [VocabularyWriting, string] =>
                    typeof pair[0] !== 'undefined'
                )
            )
          );

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private insertOrIgnoreMultipleVocabulary(
    db: knex.Transaction,
    userId: string,
    vocabularySetIdPairs: readonly [Vocabulary, string][]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          if (vocabularySetIdPairs.length > 0) {
            const vocabularyRows = vocabularySetIdPairs.map(
              ([vocabulary, setId]): VocabularyRowForInsert => {
                return this.vocabularyRowPreparer.prepareInsert(
                  userId,
                  vocabulary,
                  setId
                );
              }
            );

            const { sql, bindings } = db
              .insert(vocabularyRows)
              .into(TableName.VOCABULARY)
              .toSQL();

            queries.push(
              promisifyQuery(
                db.raw(sql.replace('insert', 'insert ignore'), bindings)
              )
            );
          }

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private updateMultipleVocabulary(
    db: knex.Transaction,
    userId: string,
    vocabularySetIdPairs: readonly [
      DeepPartial<Vocabulary>,
      undefined | string
    ][]
  ): Promise<void[]> {
    return Promise.all(
      vocabularySetIdPairs.map(
        ([vocabulary, setId]): Promise<void> => {
          return this.updateVocabulary(db, userId, vocabulary, setId);
        }
      )
    );
  }

  private updateVocabulary(
    db: knex.Transaction,
    userId: string,
    vocabulary: DeepPartial<Vocabulary>,
    setId: undefined | string
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const vocabularyRow = this.vocabularyRowPreparer.prepareUpdate(
            userId,
            vocabulary,
            setId
          );

          const vocabularyId = assertExists(vocabularyRow.vocabularyId);

          const updateFields = _.omit(vocabularyRow, [
            'userId',
            'vocabularyId',
          ]);

          const queries: Promise<void | void[]>[] = [];

          if (!_.isEmpty(updateFields)) {
            queries.push(
              promisifyQuery(
                db
                  .update(updateFields)
                  .table(TableName.VOCABULARY)
                  .where({
                    userId,
                    vocabularyId,
                  })
              )
            );
          }

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private getCompleteVocabularyByRows(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    vocabularyRows: readonly VocabularyRow[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const vocabularyIds = vocabularyRows.map(
            (row): string => row.vocabularyId
          );

          // Fetch associated definitions
          const {
            definitionsPerVocabularyId,
          } = await this.definitionModel.getDefinitionsPerVocabularyId(
            db,
            userId,
            vocabularyIds,
            stripUnknown
          );

          // Fetch vocabulary category
          const {
            vocabularyCategoryPerVocabularyId,
          } = await this.vocabularyCategoryModel.getVocabularyCategoriesByVocabularyIds(
            db,
            userId,
            vocabularyIds,
            stripUnknown
          );

          // Fetch vocabulary writing
          const {
            vocabularyWritingPerVocabularyId,
          } = await this.vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
            db,
            userId,
            vocabularyIds,
            stripUnknown
          );

          const vocabularyList: readonly Vocabulary[] = vocabularyRows.map(
            (vocabularyRow): Vocabulary => {
              // definitions can be undefined if vocabulary has no definitions
              const definitions =
                definitionsPerVocabularyId[vocabularyRow.vocabularyId];
              const vocabularyCategory =
                vocabularyCategoryPerVocabularyId[vocabularyRow.vocabularyId];
              const vocabularyWriting =
                vocabularyWritingPerVocabularyId[vocabularyRow.vocabularyId];
              return this.vocabularyRowConverter.convertToVocabulary(
                vocabularyRow,
                definitions || [],
                vocabularyCategory,
                vocabularyWriting
              );
            }
          );

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
