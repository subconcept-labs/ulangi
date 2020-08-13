/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import {
  DefinitionStatus,
  VocabularySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Definition, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as squel from 'squel';

import { VocabularyRowConverter } from '../converters/VocabularyRowConverter';
import { DatabaseEvent } from '../enums/DatabaseEvent';
import { TableName } from '../enums/TableName';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { VocabularyRow } from '../interfaces/VocabularyRow';
import { VocabularyRowPreparer } from '../preparers/VocabularyRowPreparer';
import { VocabularyRowResolver } from '../resolvers/VocabularyRowResolver';
import { addLearnedCondition } from '../utils/addLearnedCondition';
import { addVocabularySorting } from '../utils/addVocabularySorting';
import { DefinitionModel } from './DefinitionModel';
import { DirtyVocabularyModel } from './DirtyVocabularyModel';
import { VocabularyCategoryModel } from './VocabularyCategoryModel';
import { VocabularyLocalDataModel } from './VocabularyLocalDataModel';
import { VocabularyWritingModel } from './VocabularyWritingModel';

export class VocabularyModel {
  private vocabularyRowPreparer = new VocabularyRowPreparer();
  private vocabularyRowResolver = new VocabularyRowResolver();
  private vocabularyRowConverter = new VocabularyRowConverter();
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  private definitionModel: DefinitionModel;
  private vocabularyCategoryModel: VocabularyCategoryModel;
  private vocabularyLocalDataModel: VocabularyLocalDataModel;
  private vocabularyWritingModel: VocabularyWritingModel;
  private dirtyVocabularyModel: DirtyVocabularyModel;
  private databaseEventBus: DatabaseEventBus;

  public constructor(
    definitionModel: DefinitionModel,
    vocabularyCategoryModel: VocabularyCategoryModel,
    vocabularyLocalDataModel: VocabularyLocalDataModel,
    vocabularyWritingModel: VocabularyWritingModel,
    dirtyVocabularyModel: DirtyVocabularyModel,
    databaseEventBus: DatabaseEventBus
  ) {
    this.definitionModel = definitionModel;
    this.vocabularyCategoryModel = vocabularyCategoryModel;
    this.vocabularyLocalDataModel = vocabularyLocalDataModel;
    this.vocabularyWritingModel = vocabularyWritingModel;
    this.dirtyVocabularyModel = dirtyVocabularyModel;
    this.databaseEventBus = databaseEventBus;
  }

  public getVocabularyById(
    db: SQLiteDatabase,
    vocabularyId: string,
    stripUnknown: boolean
  ): Promise<null | {
    vocabulary: Vocabulary;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY)
            .where('vocabularyId = ?', vocabularyId)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          if (result.rows.length === 1) {
            const item = result.rows[0];

            const vocabularyRow = this.vocabularyRowResolver.resolve(
              item,
              stripUnknown
            );

            const vocabulary = await this.getCompleteVocabularyByRow(
              db,
              vocabularyRow,
              stripUnknown
            );

            resolve({ vocabulary });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getVocabularyList(
    db: SQLiteDatabase,
    setId: string,
    vocabularyStatus: VocabularyStatus,
    categoryNames: undefined | string[],
    sortType: VocabularySortType,
    limit: number,
    offset: number,
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field('v.*')
            .from(TableName.VOCABULARY, 'v');

          if (typeof categoryNames !== 'undefined') {
            query = query.left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            );

            if (_.includes(categoryNames, 'Uncategorized')) {
              query = query.where(
                'c.categoryName IN ? OR c.categoryName IS NULL',
                categoryNames
              );
            } else {
              query = query.where('c.categoryName IN ?', categoryNames);
            }
          }

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', vocabularyStatus);

          query = addVocabularySorting(query, sortType);

          query = query.limit(limit).offset(offset);

          const queryParam = query.toParam();

          const result = await db.executeSql(
            queryParam.text,
            queryParam.values
          );

          const vocabularyRows = this.vocabularyRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const vocabularyList = await this.getCompleteVocabularyListByRows(
            db,
            vocabularyRows,
            stripUnknown
          );

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getVocabularyBetweenRange(
    db: SQLiteDatabase,
    setId: string,
    vocabularyStatus: VocabularyStatus,
    categoryNames: undefined | string[],
    startRange: number,
    endRange: number,
    learnedOnly: boolean,
    stripUnknown: boolean
  ): Promise<null | {
    vocabularyLocalIdPair: [Vocabulary, number];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field('v.*')
            .from(TableName.VOCABULARY, 'v');

          if (learnedOnly === true) {
            query = query.left_join(
              TableName.VOCABULARY_WRITING,
              'w',
              'v.vocabularyId = w.vocabularyId'
            );
          }

          if (typeof categoryNames !== 'undefined') {
            query = query.left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            );

            if (_.includes(categoryNames, 'Uncategorized')) {
              query = query.where(
                'c.categoryName IN ? OR c.categoryName IS NULL',
                categoryNames
              );
            } else {
              query = query.where('c.categoryName IN ?', categoryNames);
            }
          }

          if (learnedOnly === true) {
            query = addLearnedCondition(query);
          }

          query = query
            .where('v.vocabularyLocalId BETWEEN ? AND ?', startRange, endRange)
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', vocabularyStatus)
            .order('v.vocabularyLocalId')
            .limit(1);

          const sql = query.toParam();

          const result = await db.executeSql(sql.text, sql.values);
          if (result.rows.length >= 1) {
            const item = result.rows[0];

            const vocabularyRow = this.vocabularyRowResolver.resolve(
              item,
              stripUnknown
            );

            const vocabulary = await this.getCompleteVocabularyByRow(
              db,
              vocabularyRow,
              stripUnknown
            );

            resolve({
              vocabularyLocalIdPair: [
                vocabulary,
                vocabularyRow.vocabularyLocalId,
              ],
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getVocabularyRange(
    db: SQLiteDatabase,
    setId: string
  ): Promise<null | [number, number]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .field('MIN(vocabularyLocalId) AS startRange')
            .field('MAX(vocabularyLocalId) AS endRange')
            .from(TableName.VOCABULARY)
            .where('setId = ?', setId)
            .toParam();

          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length === 1) {
            const item = result.rows[0];
            if (_.isNumber(item.startRange) && _.isNumber(item.endRange)) {
              resolve([item.startRange, item.endRange]);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getVocabularyListBySearchingVocabularyText(
    db: SQLiteDatabase,
    setId: string,
    searchTerm: string,
    limit: number,
    offset: number,
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY)
            .where('setId = ?', setId)
            .where(
              'vocabularyLocalId IN ?',
              squel
                .select()
                .field('rowid')
                .from(TableName.VOCABULARY_FTS4)
                .where('vocabularyText MATCH ?', searchTerm)
            )
            .limit(limit)
            .offset(offset)
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const vocabularyRows = this.vocabularyRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const vocabularyList = await this.getCompleteVocabularyListByRows(
            db,
            vocabularyRows,
            stripUnknown
          );

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getVocabularyListBySearchingDefinition(
    db: SQLiteDatabase,
    setId: string,
    searchTerm: string,
    limit: number,
    offset: number,
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .field('v.*')
            .from(TableName.VOCABULARY, 'v')
            .left_join(
              TableName.DEFINITION,
              'd',
              'v.vocabularyId = d.vocabularyId'
            )
            .where(
              'd.definitionLocalId IN ?',
              squel
                .select()
                .field('rowid')
                .from(TableName.DEFINITION_FTS4)
                .where('meaning MATCH ?', searchTerm)
            )
            .where('v.setId = ?', setId)
            .limit(limit)
            .offset(offset)
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const vocabularyRows = this.vocabularyRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const vocabularyList = await this.getCompleteVocabularyListByRows(
            db,
            vocabularyRows,
            stripUnknown
          );

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public vocabularyIdsExist(
    db: SQLiteDatabase,
    vocabularyIds: readonly string[]
  ): Promise<string[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY)
            .field('vocabularyId')
            .where('vocabularyId IN ?', vocabularyIds)
            .toParam();
          const result = await db.executeSql(query.text, query.values);
          const existingVocabularyIds = [];
          for (let i = 0; i < result.rows.length; ++i) {
            const { vocabularyId } = result.rows[i];
            existingVocabularyIds.push(vocabularyId);
          }

          resolve(existingVocabularyIds);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertVocabulary(
    tx: Transaction,
    vocabulary: Readonly<Vocabulary>,
    setId: string,
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    const vocabularyRow = this.vocabularyRowPreparer.prepareInsert(
      vocabulary,
      setId,
      source
    );

    const query = squel
      .insert()
      .into(TableName.VOCABULARY)
      .setFields(vocabularyRow)
      .toParam();

    // Insert full text search data
    /*
    const fullTextQuery = {
      text: `INSERT INTO ${
        TableName.VOCABULARY_FTS4
      } (docid, vocabularyText) VALUES (last_insert_rowid(), ?)`,
      values: [vocabularyRow.vocabularyText],
    };
    */

    const fullTextQuery = squel
      .insertOrIgnore({ rawNesting: true })
      .into(TableName.VOCABULARY_FTS4)
      .fromQuery(
        ['docid', 'vocabularyText'],
        squel
          .select({ rawNesting: true })
          .field('vocabularyLocalId')
          .field('vocabularyText')
          .from(TableName.VOCABULARY)
          .where('vocabularyId = ?', vocabularyRow.vocabularyId)
      )
      .toParam();

    tx.executeSql(query.text, query.values);
    tx.executeSql(fullTextQuery.text, fullTextQuery.values);

    // Mark fields as dirty
    if (source === 'local') {
      this.dirtyVocabularyModel.insertOrReplaceDirtyVocabularyFields(
        tx,
        vocabularyRow.vocabularyId,
        _.keys(_.omit(vocabularyRow, ['vocabularyId']))
      );
    }

    if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
      tx.onCommitted(
        (): void => {
          this.databaseEventBus.publish(
            DatabaseEvent.VOCABULARY_INSERTED_FROM_LOCAL
          );
        }
      );
    }

    this.definitionModel.upsertDefinitions(
      tx,
      vocabulary.definitions.map(
        (definition): [Definition, string] => [
          definition,
          vocabulary.vocabularyId,
        ]
      ),
      source
    );

    if (typeof vocabulary.writing !== 'undefined') {
      this.vocabularyWritingModel.upsertVocabularyWriting(
        tx,
        vocabulary.writing,
        vocabulary.vocabularyId,
        source
      );
    }

    if (typeof vocabulary.category !== 'undefined') {
      this.vocabularyCategoryModel.upsertVocabularyCategory(
        tx,
        vocabulary.category,
        vocabulary.vocabularyId,
        source
      );
    }

    this.vocabularyLocalDataModel.upsertVocabularyLocalData(
      tx,
      {
        vocabularyTerm: this.vocabularyExtraFieldParser.parse(
          vocabulary.vocabularyText
        ).vocabularyTerm,
      },
      vocabulary.vocabularyId,
      source
    );
  }

  public insertMultipleVocabulary(
    tx: Transaction,
    vocabularySetIdPairs: readonly [Vocabulary, string][],
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    vocabularySetIdPairs.forEach(
      ([vocabulary, setId]): void => {
        this.insertVocabulary(tx, vocabulary, setId, source, {
          doNotPublishEvent: true,
        });
      }
    );

    if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
      tx.onCommitted(
        (): void => {
          this.databaseEventBus.publish(
            DatabaseEvent.VOCABULARY_INSERTED_FROM_LOCAL
          );
        }
      );
    }
  }

  public updateVocabulary(
    tx: Transaction,
    vocabulary: DeepPartial<Vocabulary>,
    setId: undefined | string,
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    const vocabularyId = assertExists(vocabulary.vocabularyId);

    const vocabularyRow = this.vocabularyRowPreparer.prepareUpdate(
      vocabulary,
      setId,
      source
    );

    const updateFields =
      source === 'local'
        ? _.omit(vocabularyRow, [
            'vocabularyId',
            'createdAt',
            'firstSyncedAt',
            'lastSyncedAt',
          ])
        : _.omit(vocabularyRow, ['vocabularyId', 'createdAt']);
    if (!_.isEmpty(updateFields)) {
      // Only update the fields that are not dirty
      if (source === 'remote') {
        const queries = _.map(
          updateFields,
          (fieldValue, fieldName): squel.ParamString => {
            return squel
              .update()
              .set(fieldName, fieldValue)
              .table(TableName.VOCABULARY)
              .where('vocabularyId = ?', vocabularyId)
              .where(
                'NOT EXISTS ?',
                squel
                  .select()
                  .from(TableName.DIRTY_VOCABULARY_FIELD)
                  .where('vocabularyId = ?', vocabularyId)
                  .where('fieldName = ?', fieldName)
              )
              .toParam();
          }
        );

        // Only update full text search when vocabulary text changes
        const fullTextQuery =
          typeof updateFields.vocabularyText !== 'undefined'
            ? squel
                .update()
                .set('vocabularyText', updateFields.vocabularyText)
                .table(TableName.VOCABULARY_FTS4)
                .where(
                  'docid IN ?',
                  squel
                    .select()
                    .from(TableName.VOCABULARY)
                    .field('vocabularyLocalId')
                    .where('vocabularyId = ?', vocabularyId)
                    .where(
                      'NOT EXISTS ?',
                      squel
                        .select()
                        .from(TableName.DIRTY_VOCABULARY_FIELD)
                        .where('vocabularyId = ?', vocabularyId)
                        .where('fieldName = vocabularyText')
                    )
                )
                .toParam()
            : undefined;

        // According to Sqlite docs, any UPDATE or DELETE operations must be applied first to the FTS table, and then to the external content table
        if (typeof fullTextQuery !== 'undefined') {
          tx.executeSql(fullTextQuery.text, fullTextQuery.values);
        }

        queries.forEach(
          (query): void => {
            tx.executeSql(query.text, query.values);
          }
        );
      } else {
        const query = squel
          .update()
          .table(TableName.VOCABULARY)
          .setFields(updateFields)
          .where('vocabularyId = ?', vocabularyId)
          .toParam();

        // Only update full text search when vocabularyText changes
        const fullTextQuery =
          typeof updateFields.vocabularyText !== 'undefined'
            ? squel
                .update()
                .set('vocabularyText', updateFields.vocabularyText)
                .table(TableName.VOCABULARY_FTS4)
                .where(
                  'docid IN ?',
                  squel
                    .select()
                    .from(TableName.VOCABULARY)
                    .field('vocabularyLocalId')
                    .where('vocabularyId = ?', vocabularyId)
                )
                .toParam()
            : undefined;

        // According to Sqlite docs, any UPDATE or DELETE operations must be applied first to the FTS table, and then to the external content table
        if (typeof fullTextQuery !== 'undefined') {
          tx.executeSql(fullTextQuery.text, fullTextQuery.values);
        }

        tx.executeSql(query.text, query.values);

        // Mark fields as dirty
        this.dirtyVocabularyModel.insertOrReplaceDirtyVocabularyFields(
          tx,
          vocabularyId,
          _.keys(_.omit(vocabularyRow, ['vocabularyId']))
        );
      }

      if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
        tx.onCommitted(
          (): void => {
            this.databaseEventBus.publish(
              DatabaseEvent.VOCABULARY_UPDATED_FROM_LOCAL
            );
          }
        );
      }
    }

    if (typeof vocabulary.definitions !== 'undefined') {
      this.definitionModel.upsertDefinitions(
        tx,
        vocabulary.definitions.map(
          (definition): [DeepPartial<Definition>, string | undefined] => [
            definition,
            vocabulary.vocabularyId,
          ]
        ),
        source
      );
    }

    if (typeof vocabulary.writing !== 'undefined') {
      this.vocabularyWritingModel.upsertVocabularyWriting(
        tx,
        vocabulary.writing,
        vocabularyId,
        source
      );
    }

    if (typeof vocabulary.category !== 'undefined') {
      this.vocabularyCategoryModel.upsertVocabularyCategory(
        tx,
        vocabulary.category,
        vocabularyId,
        source
      );
    }

    if (typeof vocabulary.vocabularyText !== 'undefined') {
      this.vocabularyLocalDataModel.upsertVocabularyLocalData(
        tx,
        {
          vocabularyTerm: this.vocabularyExtraFieldParser.parse(
            vocabulary.vocabularyText
          ).vocabularyTerm,
        },
        vocabularyId,
        source
      );
    }
  }

  public updateMultipleVocabulary(
    tx: Transaction,
    vocabularySetIdPairs: readonly [
      DeepPartial<Vocabulary>,
      undefined | string
    ][],
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    vocabularySetIdPairs.forEach(
      ([vocabulary, setId]): void => {
        this.updateVocabulary(tx, vocabulary, setId, source, {
          doNotPublishEvent: true,
        });
      }
    );

    if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
      tx.onCommitted(
        (): void => {
          this.databaseEventBus.publish(
            DatabaseEvent.VOCABULARY_UPDATED_FROM_LOCAL
          );
        }
      );
    }
  }

  public getLatestSyncTime(db: SQLiteDatabase): Promise<null | Date> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .field('MAX(lastSyncedAt) AS latestSyncTime')
            .from(TableName.VOCABULARY)
            .toParam();
          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length === 1) {
            const { latestSyncTime } = result.rows[0];
            resolve(
              latestSyncTime ? moment.unix(latestSyncTime).toDate() : null
            );
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async getCompleteVocabularyByRow(
    db: SQLiteDatabase,
    vocabularyRow: VocabularyRow,
    stripUnknown: boolean
  ): Promise<Vocabulary> {
    const vocabularyList = await this.getCompleteVocabularyListByRows(
      db,
      [vocabularyRow],
      stripUnknown
    );

    return assertExists(_.first(vocabularyList));
  }

  public async getCompleteVocabularyListByRows(
    db: SQLiteDatabase,
    vocabularyRows: readonly VocabularyRow[],
    stripUnknown: boolean
  ): Promise<readonly Vocabulary[]> {
    const vocabularyIds = vocabularyRows.map(
      (vocabularyRow): string => vocabularyRow.vocabularyId
    );

    // Fetch definitions
    const {
      definitionsPerVocabularyId,
    } = await this.definitionModel.getDefinitionsByVocabularyIds(
      db,
      vocabularyIds,
      DefinitionStatus.ACTIVE,
      stripUnknown
    );

    // Fetch category
    const {
      vocabularyCategoryPerVocabularyId,
    } = await this.vocabularyCategoryModel.getVocabularyCategoryByVocabularyIds(
      db,
      vocabularyIds,
      stripUnknown
    );

    // Fetch writing
    const {
      vocabularyWritingPerVocabularyId,
    } = await this.vocabularyWritingModel.getVocabularyWritingsByVocabularyIds(
      db,
      vocabularyIds,
      stripUnknown
    );

    const vocabularyList = vocabularyRows.map(
      (vocabularyRow): Vocabulary => {
        const definitions =
          typeof definitionsPerVocabularyId[vocabularyRow.vocabularyId] !==
          'undefined'
            ? definitionsPerVocabularyId[vocabularyRow.vocabularyId]
            : [];
        const vocabularyCategory =
          typeof vocabularyCategoryPerVocabularyId !== 'undefined'
            ? vocabularyCategoryPerVocabularyId[vocabularyRow.vocabularyId]
            : undefined;
        const vocabularyWriting =
          typeof vocabularyWritingPerVocabularyId !== 'undefined'
            ? vocabularyWritingPerVocabularyId[vocabularyRow.vocabularyId]
            : undefined;
        return this.vocabularyRowConverter.convertToVocabulary(
          vocabularyRow,
          definitions,
          vocabularyCategory,
          vocabularyWriting,
          []
        );
      }
    );

    return vocabularyList;
  }
}
