/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { VocabularyWriting } from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';

import { VocabularyWritingRowConverter } from '../converters/VocabularyWritingRowConverter';
import { TableName } from '../enums/TableName';
import {
  VocabularyWritingRow,
  VocabularyWritingRowForUpsert,
} from '../interfaces/VocabularyWritingRow';
import { VocabularyWritingRowPreparer } from '../preparers/VocabularyWritingRowPreparer';
import { VocabularyWritingRowResolver } from '../resolvers/VocabularyWritingRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class VocabularyWritingModel {
  private vocabularyWritingRowResolver = new VocabularyWritingRowResolver();
  private vocabularyWritingRowConverter = new VocabularyWritingRowConverter();
  private VocabularyWritingRowPreparer = new VocabularyWritingRowPreparer();

  public getVocabularyWritingsByVocabularyIds(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyWritingPerVocabularyId: { [P in string]: VocabularyWriting };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const results = await promisifyQuery(
            db
              .select()
              .from(TableName.VOCABULARY_WRITING)
              .where('userId', userId)
              .whereIn('vocabularyId', vocabularyIds.slice())
          );

          const vocabularyWritingRows = this.vocabularyWritingRowResolver.resolveArray(
            results,
            stripUnknown
          );

          const vocabularyWritingRowPerVocabularyId = _.fromPairs(
            vocabularyWritingRows.map(
              (row): [string, VocabularyWritingRow] => {
                return [row.vocabularyId, row];
              }
            )
          );

          const vocabularyWritingPerVocabularyId = _.mapValues(
            vocabularyWritingRowPerVocabularyId,
            (row): VocabularyWriting => {
              return this.vocabularyWritingRowConverter.convertToVocabularyWriting(
                row
              );
            }
          );

          resolve({ vocabularyWritingPerVocabularyId });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertVocabularyWritings(
    db: knex.Transaction,
    userId: string,
    vocabularyWritingVocabularyIdPairs: readonly [
      DeepPartial<VocabularyWriting>,
      string
    ][]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void | void[]>[] = [];

          if (vocabularyWritingVocabularyIdPairs.length > 0) {
            const vocabularyWritingRows = vocabularyWritingVocabularyIdPairs.map(
              ([
                vocabularyWriting,
                vocabularyId,
              ]): VocabularyWritingRowForUpsert => {
                return this.VocabularyWritingRowPreparer.prepareUpsert(
                  userId,
                  vocabularyWriting,
                  vocabularyId
                );
              }
            );

            const { sql, bindings } = db
              .insert(vocabularyWritingRows)
              .into(TableName.VOCABULARY_WRITING)
              .toSQL();

            queries.push(
              promisifyQuery(
                db.raw(sql.replace('insert', 'insert ignore'), bindings)
              )
            );

            queries.push(
              ...vocabularyWritingRows.map(
                (vocabularyWritingRow): Promise<void> => {
                  const { userId, vocabularyId } = vocabularyWritingRow;
                  const updateFields = _.omit(vocabularyWritingRow, [
                    'userId',
                    'vocabularyId',
                  ]);
                  return promisifyQuery(
                    db
                      .update(updateFields)
                      .table(TableName.VOCABULARY_WRITING)
                      .where({
                        userId,
                        vocabularyId,
                      })
                  );
                }
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
}
