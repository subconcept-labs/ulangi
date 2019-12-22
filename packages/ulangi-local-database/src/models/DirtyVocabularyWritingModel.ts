/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { Result, SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { VocabularyWriting } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { VocabularyWritingRowConverter } from '../converters/VocabularyWritingRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { DirtyVocabularyWritingFieldRow } from '../interfaces/DirtyVocabularyWritingFieldRow';
import { VocabularyWritingRow } from '../interfaces/VocabularyWritingRow';
import { DirtyVocabularyWritingFieldRowPreparer } from '../preparers/DirtyVocabularyWritingFieldRowPreparer';
import { DirtyVocabularyWritingFieldRowResolver } from '../resolvers/DirtyVocabularyWritingFieldRowResolver';
import { VocabularyWritingRowResolver } from '../resolvers/VocabularyWritingRowResolver';

export class DirtyVocabularyWritingModel {
  private vocabularyWritingRowResolver = new VocabularyWritingRowResolver();
  private vocabularyWritingRowConverter = new VocabularyWritingRowConverter();
  private dirtyFieldRowPreparer = new DirtyVocabularyWritingFieldRowPreparer();
  private dirtyFieldRowResolver = new DirtyVocabularyWritingFieldRowResolver();

  public getDirtyVocabularyWritingsForSyncing(
    db: SQLiteDatabase,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyWritingPerVocabularyId: {
      [P in string]: DeepPartial<VocabularyWriting>
    };
    markVocabularyWritingsAsSynced: (
      tx: Transaction,
      syncedVocabularyIds: readonly string[]
    ) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.DIRTY_VOCABULARY_WRITING_FIELD, 'F')
            .join(
              TableName.VOCABULARY_WRITING,
              'W',
              'W.vocabularyId = F.vocabularyId'
            )
            .field('GROUP_CONCAT(F.fieldName) as fieldNames')
            .field('GROUP_CONCAT(F.createdAt) as creationTimestamps')
            .field('GROUP_CONCAT(F.updatedAt) as updateTimestamps')
            .field('GROUP_CONCAT(F.fieldState) as fieldStates')
            .field('W.vocabularyId')
            .where('W.vocabularyId IN ?', vocabularyIds)
            .group('W.vocabularyId')
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const fieldsPerVocabularyId: [
            string,
            string[],
            string[],
            string[],
            string[]
          ][] = [];
          for (let i = 0; i < result.rows.length; ++i) {
            const item = result.rows[i];
            fieldsPerVocabularyId.push([
              item.vocabularyId,
              item.fieldNames.split(','),
              item.creationTimestamps.split(','),
              item.updateTimestamps.split(','),
              item.fieldStates.split(','),
            ]);
          }

          const unresolvedFieldRows = _.flatMap(
            fieldsPerVocabularyId,
            ([
              vocabularyId,
              fieldNames,
              creationTimestamps,
              updateTimestamps,
              fieldStates,
            ]): object[] => {
              return fieldNames.map(
                (fieldName, index): object => {
                  return {
                    vocabularyId,
                    fieldName: fieldName,
                    createdAt: creationTimestamps[index],
                    updatedAt: updateTimestamps[index],
                    fieldState: fieldStates[index],
                  };
                }
              );
            }
          );

          const fieldRows = this.dirtyFieldRowResolver.resolveArray(
            unresolvedFieldRows,
            stripUnknown
          );

          // Mark dirty fields as syncing
          await db.transaction(
            (tx): void =>
              this.transitionFieldStates(
                tx,
                fieldRows.map(
                  (
                    fieldRow
                  ): Pick<
                    DirtyVocabularyWritingFieldRow,
                    'vocabularyId' | 'fieldName'
                  > => {
                    return {
                      vocabularyId: fieldRow.vocabularyId,
                      fieldName: fieldRow.fieldName,
                    };
                  }
                ),
                { toState: FieldState.SYNCING }
              )
          );

          // Get values of the dirty fields
          const results: Result[] = await Promise.all(
            fieldsPerVocabularyId.map(
              ([vocabularyId, fieldNames]): Promise<Result> => {
                const query = squel
                  .select()
                  .from(TableName.VOCABULARY_WRITING)
                  .field('vocabularyId')
                  .fields(fieldNames)
                  .where('vocabularyId = ?', vocabularyId)
                  .limit(1)
                  .toParam();
                return db.executeSql(query.text, query.values);
              }
            )
          );

          const allRows = _.flatMap(
            results,
            (result): readonly any[] => {
              return result.rows;
            }
          );

          const vocabularyWritingRows = this.vocabularyWritingRowResolver.resolvePartialArray(
            allRows,
            stripUnknown
          );

          const vocabularyWritingRowPerVocabularyId = _.fromPairs(
            vocabularyWritingRows.map(
              (
                vocabularyWritingRow
              ): [string, DeepPartial<VocabularyWritingRow>] => [
                assertExists(vocabularyWritingRow.vocabularyId),
                vocabularyWritingRow,
              ]
            )
          );

          const vocabularyWritingPerVocabularyId = _.mapValues(
            vocabularyWritingRowPerVocabularyId,
            (vocabularyWritingRow): DeepPartial<VocabularyWriting> => {
              return this.vocabularyWritingRowConverter.convertToPartialVocabularyWriting(
                vocabularyWritingRow
              );
            }
          );

          const markVocabularyWritingsAsSynced = (
            tx: Transaction,
            syncedVocabularyIds: readonly string[]
          ): void => {
            this.deleteDirtyFields(
              tx,
              fieldRows
                .filter(
                  (fieldRow): boolean => {
                    return _.includes(
                      syncedVocabularyIds,
                      fieldRow.vocabularyId
                    );
                  }
                )
                .map(
                  (
                    fieldRow
                  ): Pick<
                    DirtyVocabularyWritingFieldRow,
                    'vocabularyId' | 'fieldName'
                  > => {
                    return {
                      vocabularyId: fieldRow.vocabularyId,
                      fieldName: fieldRow.fieldName,
                    };
                  }
                ),
              {
                withState: FieldState.SYNCING,
              }
            );
          };

          resolve({
            vocabularyWritingPerVocabularyId,
            markVocabularyWritingsAsSynced,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public deleteDirtyField(
    tx: Transaction,
    fieldRow: Pick<
      DirtyVocabularyWritingFieldRow,
      'vocabularyId' | 'fieldName'
    >,
    conditions: { withState: FieldState }
  ): void {
    const query = squel
      .delete()
      .from(TableName.DIRTY_VOCABULARY_WRITING_FIELD)
      .where('vocabularyId = ?', fieldRow.vocabularyId)
      .where('fieldName = ?', fieldRow.fieldName)
      .where('fieldState = ?', conditions.withState)
      .toParam();
    tx.executeSql(query.text, query.values);
  }

  public deleteDirtyFields(
    tx: Transaction,
    fieldRows: readonly Pick<
      DirtyVocabularyWritingFieldRow,
      'vocabularyId' | 'fieldName'
    >[],
    conditions: { withState: FieldState }
  ): void {
    fieldRows.forEach(
      (row): void => {
        this.deleteDirtyField(tx, row, conditions);
      }
    );
  }

  public insertOrReplaceDirtyFields(
    tx: Transaction,
    vocabularyId: string,
    fieldNames: readonly string[]
  ): void {
    fieldNames.forEach(
      (fieldName): void => {
        this.insertOrReplaceDirtyField(tx, vocabularyId, fieldName);
      }
    );
  }

  public insertOrReplaceDirtyField(
    tx: Transaction,
    vocabularyId: string,
    fieldName: string
  ): void {
    const fieldRow = this.prepareDirtyFieldForInsert(vocabularyId, fieldName);

    const dirtyQuery = squel
      .insertOrReplace()
      .into(TableName.DIRTY_VOCABULARY_WRITING_FIELD)
      .setFields(fieldRow)
      .toParam();

    tx.executeSql(dirtyQuery.text, dirtyQuery.values);
  }

  public transitionFieldState(
    tx: Transaction,
    fieldRow: Pick<
      DirtyVocabularyWritingFieldRow,
      'vocabularyId' | 'fieldName'
    >,
    transition: { toState: FieldState }
  ): void {
    const { vocabularyId, fieldName } = fieldRow;
    const query = squel
      .update()
      .table(TableName.DIRTY_VOCABULARY_WRITING_FIELD)
      .where('vocabularyId = ?', vocabularyId)
      .where('fieldName = ?', fieldName)
      .setFields({ fieldState: transition.toState })
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public transitionFieldStates(
    tx: Transaction,
    fieldRows: readonly Pick<
      DirtyVocabularyWritingFieldRow,
      'vocabularyId' | 'fieldName'
    >[],
    transition: { toState: FieldState }
  ): void {
    fieldRows.forEach(
      (fieldRow): void => {
        this.transitionFieldState(tx, fieldRow, transition);
      }
    );
  }

  private prepareDirtyFieldForInsert(
    vocabularyId: string,
    fieldName: string
  ): DirtyVocabularyWritingFieldRow {
    return this.dirtyFieldRowPreparer.prepareInsert(
      vocabularyId,
      fieldName,
      FieldState.TO_BE_SYNCED
    );
  }
}
