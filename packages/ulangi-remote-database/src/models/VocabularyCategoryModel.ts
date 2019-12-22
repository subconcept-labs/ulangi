/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';

import { VocabularyCategoryRowConverter } from '../converters/VocabularyCategoryRowConverter';
import { TableName } from '../enums/TableName';
import {
  VocabularyCategoryRow,
  VocabularyCategoryRowForUpsert,
} from '../interfaces/VocabularyCategoryRow';
import { VocabularyCategoryRowPreparer } from '../preparers/VocabularyCategoryRowPreparer';
import { VocabularyCategoryRowResolver } from '../resolvers/VocabularyCategoryRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class VocabularyCategoryModel {
  private vocabularyCategoryRowResolver = new VocabularyCategoryRowResolver();
  private vocabularyCategoryRowPreparer = new VocabularyCategoryRowPreparer();
  private vocabularyCategoryRowConverter = new VocabularyCategoryRowConverter();

  public getVocabularyCategoriesByVocabularyIds(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyCategoryPerVocabularyId: { [P in string]: VocabularyCategory };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.VOCABULARY_CATEGORY)
              .where('userId', userId)
              .whereIn('vocabularyId', vocabularyIds.slice())
          );

          const vocabularyCategoryRows = this.vocabularyCategoryRowResolver.resolveArray(
            result,
            stripUnknown
          );

          const vocabularyCategoryRowPerVocabularyId = _.fromPairs(
            vocabularyCategoryRows.map(
              (row): [string, VocabularyCategoryRow] => [row.vocabularyId, row]
            )
          );

          const vocabularyCategoryPerVocabularyId = _.mapValues(
            vocabularyCategoryRowPerVocabularyId,
            (row): VocabularyCategory => {
              return this.vocabularyCategoryRowConverter.convertToVocabularyCategory(
                row
              );
            }
          );

          resolve({
            vocabularyCategoryPerVocabularyId,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertVocabularyCategories(
    db: knex.Transaction,
    userId: string,
    vocabularyCategoryVocabularyIdPairs: readonly [
      DeepPartial<VocabularyCategory>,
      string
    ][]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          if (vocabularyCategoryVocabularyIdPairs.length > 0) {
            const vocabularyCategoryRows = vocabularyCategoryVocabularyIdPairs.map(
              ([
                vocabularyCategory,
                vocabularyId,
              ]): VocabularyCategoryRowForUpsert => {
                return this.vocabularyCategoryRowPreparer.prepareUpsert(
                  userId,
                  vocabularyCategory,
                  assertExists(vocabularyId)
                );
              }
            );

            const { sql, bindings } = db
              .insert(vocabularyCategoryRows)
              .into(TableName.VOCABULARY_CATEGORY)
              .toSQL();

            queries.push(
              promisifyQuery(
                db.raw(sql.replace('insert', 'insert ignore'), bindings)
              )
            );

            queries.push(
              ...vocabularyCategoryRows.map(
                (vocabularyCategoryRow): Promise<void> => {
                  const { userId, vocabularyId } = vocabularyCategoryRow;
                  const updateFields = _.omit(vocabularyCategoryRow, [
                    'userId',
                    'vocabularyId',
                  ]);
                  return promisifyQuery(
                    db
                      .update(updateFields)
                      .table(TableName.VOCABULARY_CATEGORY)
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
