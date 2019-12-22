/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { VocabularyCategoryRowConverter } from '../converters/VocabularyCategoryRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { VocabularyCategoryRow } from '../interfaces/VocabularyCategoryRow';
import { VocabularyCategoryRowPreparer } from '../preparers/VocabularyCategoryRowPreparer';
import { VocabularyCategoryRowResolver } from '../resolvers/VocabularyCategoryRowResolver';

export class VocabularyCategoryModel {
  private vocabularyCategoryRowResolver = new VocabularyCategoryRowResolver();
  private vocabularyCategoryRowPreparer = new VocabularyCategoryRowPreparer();
  private vocabularyCategoryRowConverter = new VocabularyCategoryRowConverter();

  public getVocabularyCategoryByVocabularyId(
    db: SQLiteDatabase,
    vocabularyId: string,
    stripUnknown: boolean
  ): Promise<{
    vocabularyCategory?: VocabularyCategory;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY_CATEGORY)
            .where('vocabularyId = ?', vocabularyId)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          if (result.rows.length > 0) {
            const vocabularyCategoryRow = this.vocabularyCategoryRowResolver.resolve(
              result.rows[0],
              stripUnknown
            );
            const vocabularyCategory = new VocabularyCategoryRowConverter().convertToVocabularyCategory(
              vocabularyCategoryRow
            );
            resolve({ vocabularyCategory });
          } else {
            resolve({ vocabularyCategory: undefined });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getVocabularyCategoryByVocabularyIds(
    db: SQLiteDatabase,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyCategoryPerVocabularyId: { [P in string]: VocabularyCategory };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY_CATEGORY)
            .where(
              `vocabularyId IN (${vocabularyIds
                .map((): string => '?')
                .join(',')})`,
              ...vocabularyIds
            )
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const vocabularyCategoryRows = this.vocabularyCategoryRowResolver.resolveArray(
            result.rows.slice(),
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

          resolve({ vocabularyCategoryPerVocabularyId });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertVocabularyCategory(
    tx: Transaction,
    vocabularyCategory: DeepPartial<VocabularyCategory>,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): void {
    const vocabularyCategoryRow = this.vocabularyCategoryRowPreparer.prepareUpsert(
      vocabularyCategory,
      vocabularyId,
      source
    );

    // Omit fields shouldn't be updated
    const updateFields =
      source === 'local'
        ? _.omit(vocabularyCategoryRow, [
            'vocabularyId',
            'createdAt',
            'firstSyncedAt',
            'lastSyncedAt',
          ])
        : _.omit(vocabularyCategoryRow, ['vocabularyId', 'createdAt']);

    const insertOrIgnoreQuery = squel
      .insertOrIgnore()
      .into(TableName.VOCABULARY_CATEGORY)
      .setFields(vocabularyCategoryRow)
      .toParam();

    let updateQuery;
    if (source === 'remote') {
      // Only update if row is not dirty
      updateQuery = squel
        .update()
        .table(TableName.VOCABULARY_CATEGORY)
        .setFields(updateFields)
        .where('vocabularyId = ?', vocabularyId)
        .where('fieldState = ?', FieldState.SYNCED)
        .toParam();
    } else {
      updateQuery = squel
        .update()
        .table(TableName.VOCABULARY_CATEGORY)
        .setFields(updateFields)
        .where('vocabularyId = ?', vocabularyId)
        .toParam();
    }

    tx.executeSql(updateQuery.text, updateQuery.values);
    tx.executeSql(insertOrIgnoreQuery.text, insertOrIgnoreQuery.values);
  }

  public upsertVocabularyCategories(
    tx: Transaction,
    vocabularyCategoryVocabularyIdPairs: readonly [
      DeepPartial<VocabularyCategory>,
      string
    ][],
    source: 'local' | 'remote'
  ): void {
    vocabularyCategoryVocabularyIdPairs.forEach(
      ([vocabularyCategory, vocabularyId]): void => {
        this.upsertVocabularyCategory(
          tx,
          vocabularyCategory,
          vocabularyId,
          source
        );
      }
    );
  }
}
