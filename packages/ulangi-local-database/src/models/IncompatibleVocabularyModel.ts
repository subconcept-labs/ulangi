/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import * as _ from 'lodash';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';
import { IncompatibleVocabularyRowPreparer } from '../preparers/IncompatibleVocabularyRowPreparer';
import { IncompatibleVocabularyRowResolver } from '../resolvers/IncompatibleVocabularyRowResolver';

export class IncompatibleVocabularyModel {
  private incompatibleVocabularyRowResolver = new IncompatibleVocabularyRowResolver();
  private incompatibleVocabularyRowPreparer = new IncompatibleVocabularyRowPreparer();

  public getIncompatibleVocabularyIdsForRedownload(
    db: SQLiteDatabase,
    currentCommonVersion: string,
    limit: number,
    stripUnknown: boolean
  ): Promise<{
    vocabularyIds: readonly string[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.INCOMPATIBLE_VOCABULARY)
            .where('lastTriedCommonVersion < ?', currentCommonVersion)
            .limit(limit)
            .toParam();

          const result = await db.executeSql(query.text, query.values);
          const incompatibleVocabularyRows = this.incompatibleVocabularyRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );
          const vocabularyIds = incompatibleVocabularyRows.map(
            (row): string => row.vocabularyId
          );

          resolve({ vocabularyIds });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertIncompatibleVocabulary(
    tx: Transaction,
    vocabularyId: string,
    currentCommonVersion: string
  ): void {
    const incompatibleVocabularyRow = this.incompatibleVocabularyRowPreparer.prepareUpsert(
      vocabularyId,
      currentCommonVersion
    );
    // Omit all fields shouldn't be updated if the record already existed
    const updateFields = _.omit(incompatibleVocabularyRow, ['vocabularyId']);

    const insertOrIgnoreQuery = squel
      .insertOrIgnore()
      .into(TableName.INCOMPATIBLE_VOCABULARY)
      .setFields(incompatibleVocabularyRow)
      .toParam();

    const updateQuery = squel
      .update()
      .table(TableName.INCOMPATIBLE_VOCABULARY)
      .setFields(updateFields)
      .where('vocabularyId = ?', vocabularyId)
      .toParam();

    tx.executeSql(updateQuery.text, updateQuery.values);
    tx.executeSql(insertOrIgnoreQuery.text, insertOrIgnoreQuery.values);
  }

  public upsertMultipleIncompatibleVocabulary(
    tx: Transaction,
    vocabularyIds: readonly string[],
    currentCommonVersion: string
  ): void {
    vocabularyIds.forEach(
      (vocabularyId): void => {
        this.upsertIncompatibleVocabulary(
          tx,
          vocabularyId,
          currentCommonVersion
        );
      }
    );
  }

  public deleteIncompatibleVocabulary(
    tx: Transaction,
    vocabularyId: string
  ): void {
    const query = squel
      .delete()
      .from(TableName.INCOMPATIBLE_VOCABULARY)
      .where('vocabularyId = ?', vocabularyId)
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public deleteMultipleIncompatibleVocabulary(
    tx: Transaction,
    vocabularyIds: readonly string[]
  ): void {
    vocabularyIds.forEach(
      (vocabularyId): void => {
        this.deleteIncompatibleVocabulary(tx, vocabularyId);
      }
    );
  }
}
