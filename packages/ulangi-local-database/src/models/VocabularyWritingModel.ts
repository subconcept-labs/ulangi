/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { VocabularyWriting } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { VocabularyWritingRowConverter } from '../converters/VocabularyWritingRowConverter';
import { TableName } from '../enums/TableName';
import { VocabularyWritingRow } from '../interfaces/VocabularyWritingRow';
import { VocabularyWritingRowPreparer } from '../preparers/VocabularyWritingRowPreparer';
import { VocabularyWritingRowResolver } from '../resolvers/VocabularyWritingRowResolver';
import { DirtyVocabularyWritingModel } from './DirtyVocabularyWritingModel';

export class VocabularyWritingModel {
  private vocabularyWritingRowResolver = new VocabularyWritingRowResolver();
  private vocabularyWritingRowConverter = new VocabularyWritingRowConverter();
  private vocabularyWritingRowPreparer = new VocabularyWritingRowPreparer();

  private dirtyVocabularyWritingModel: DirtyVocabularyWritingModel;

  public constructor(dirtyVocabularyWritingModel: DirtyVocabularyWritingModel) {
    this.dirtyVocabularyWritingModel = dirtyVocabularyWritingModel;
  }

  public getVocabularyWritingsByVocabularyIds(
    db: SQLiteDatabase,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyWritingPerVocabularyId: { [P in string]: VocabularyWriting };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY_WRITING)
            .where(
              `vocabularyId IN (${vocabularyIds
                .map((): string => '?')
                .join(',')})`,
              ...vocabularyIds
            )
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const vocabularyWritingRows = this.vocabularyWritingRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const vocabularyWritingRowPerVocabularyId = _.fromPairs(
            vocabularyWritingRows.map(
              (row): [string, VocabularyWritingRow] => [row.vocabularyId, row]
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

  public upsertVocabularyWriting(
    tx: Transaction,
    vocabularyWriting: DeepPartial<VocabularyWriting>,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): void {
    const vocabularyWritingRow = this.vocabularyWritingRowPreparer.prepareUpsert(
      vocabularyWriting,
      vocabularyId,
      source
    );

    // Omit fields should not be updated
    const updateFields =
      source === 'local'
        ? _.omit(vocabularyWritingRow, [
            'vocabularyId',
            'createdAt',
            'firstSyncedAt',
            'lastSyncedAt',
          ])
        : _.omit(vocabularyWritingRow, ['vocabularyId', 'createdAt']);

    const insertOrIngoreQuery = squel
      .insertOrIgnore()
      .into(TableName.VOCABULARY_WRITING)
      .setFields(vocabularyWritingRow)
      .toParam();

    if (source === 'remote') {
      // Only update the fields that are not dirty
      const updateQueries = _.map(
        updateFields,
        (fieldValue, fieldName): squel.ParamString => {
          return squel
            .update()
            .set(fieldName, fieldValue)
            .table(TableName.VOCABULARY_WRITING)
            .where('vocabularyId = ?', vocabularyId)
            .where(
              'NOT EXISTS ?',
              squel
                .select()
                .from(TableName.DIRTY_VOCABULARY_WRITING_FIELD)
                .where('vocabularyId = ?', vocabularyId)
                .where('fieldName = ?', fieldName)
            )
            .toParam();
        }
      );

      updateQueries.forEach(
        (query): void => {
          tx.executeSql(query.text, query.values);
        }
      );
      tx.executeSql(insertOrIngoreQuery.text, insertOrIngoreQuery.values);
    } else {
      const updateQuery = squel
        .update()
        .table(TableName.VOCABULARY_WRITING)
        .setFields(updateFields)
        .where('vocabularyId = ?', vocabularyId)
        .toParam();

      tx.executeSql(updateQuery.text, updateQuery.values);
      tx.executeSql(insertOrIngoreQuery.text, insertOrIngoreQuery.values);

      // Mark fields as dirty
      this.dirtyVocabularyWritingModel.insertOrReplaceDirtyFields(
        tx,
        vocabularyId,
        _.keys(_.omit(vocabularyWritingRow, ['vocabularyId']))
      );
    }
  }

  public upsertVocabularyWritings(
    tx: Transaction,
    vocabularyWritingVocabularyIdPairs: readonly [
      DeepPartial<VocabularyWriting>,
      string
    ][],
    source: 'local' | 'remote'
  ): void {
    vocabularyWritingVocabularyIdPairs.forEach(
      ([vocabularyWriting, vocabularyId]): void => {
        this.upsertVocabularyWriting(
          tx,
          vocabularyWriting,
          vocabularyId,
          source
        );
      }
    );
  }
}
