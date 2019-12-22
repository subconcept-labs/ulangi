/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial, ReadonlyTuple } from '@ulangi/extended-types';
import { Result, SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { VocabularyRowConverter } from '../converters/VocabularyRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { DirtyVocabularyFieldRow } from '../interfaces/DirtyVocabularyFieldRow';
import { DirtyVocabularyFieldRowPreparer } from '../preparers/DirtyVocabularyFieldRowPreparer';
import { DirtyVocabularyFieldRowResolver } from '../resolvers/DirtyVocabularyFieldRowResolver';
import { VocabularyRowResolver } from '../resolvers/VocabularyRowResolver';
import { DirtyDefinitionModel } from './DirtyDefinitionModel';
import { DirtyVocabularyCategoryModel } from './DirtyVocabularyCategoryModel';
import { DirtyVocabularyWritingModel } from './DirtyVocabularyWritingModel';

export class DirtyVocabularyModel {
  private vocabularyRowResolver = new VocabularyRowResolver();
  private vocabularyRowConverter = new VocabularyRowConverter();
  private dirtyFieldRowResolver = new DirtyVocabularyFieldRowResolver();
  private dirtyFieldRowPreparer = new DirtyVocabularyFieldRowPreparer();

  private dirtyDefinitionModel: DirtyDefinitionModel;
  private dirtyVocabularyCategoryModel: DirtyVocabularyCategoryModel;
  private dirtyVocabularyWritingModel: DirtyVocabularyWritingModel;

  public constructor(
    dirtyDefinitionModel: DirtyDefinitionModel,
    dirtyVocabularyCategoryModel: DirtyVocabularyCategoryModel,
    dirtyVocabularyWritingModel: DirtyVocabularyWritingModel
  ) {
    this.dirtyDefinitionModel = dirtyDefinitionModel;
    this.dirtyVocabularyCategoryModel = dirtyVocabularyCategoryModel;
    this.dirtyVocabularyWritingModel = dirtyVocabularyWritingModel;
  }

  public getDirtyVocabularyListForSyncing(
    db: SQLiteDatabase,
    limit: number,
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly DeepPartial<Vocabulary>[];
    vocabularyIdSetIdPairs: readonly ReadonlyTuple<string, string>[];
    markVocabularyListAsSynced: (
      tx: Transaction,
      syncedVocabularyIds: readonly string[]
    ) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const fieldQuery = squel
            .select()
            .from(TableName.DIRTY_VOCABULARY_FIELD)
            .field('GROUP_CONCAT(fieldName) as fieldNames')
            .field('GROUP_CONCAT(createdAt) as creationTimestamps')
            .field('GROUP_CONCAT(updatedAt) as updateTimestamps')
            .field('GROUP_CONCAT(fieldState) as fieldStates')
            .field('vocabularyId')
            .group('vocabularyId')
            .limit(limit)
            .toParam();

          const result = await db.executeSql(
            fieldQuery.text,
            fieldQuery.values
          );
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
                    fieldName,
                    createdAt: creationTimestamps[index],
                    updatedAt: updateTimestamps[index],
                    fieldState: fieldStates[index],
                  };
                }
              );
            }
          );

          const vocabularyFieldRows = this.dirtyFieldRowResolver.resolveArray(
            unresolvedFieldRows,
            stripUnknown
          );

          // Mark dirty fields as syncing
          await db.transaction(
            (tx): void =>
              this.transitionFieldStates(
                tx,
                vocabularyFieldRows.map(
                  (
                    fieldRow
                  ): Pick<
                    DirtyVocabularyFieldRow,
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
                  .from(TableName.VOCABULARY)
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

          const vocabularyRows = this.vocabularyRowResolver.resolvePartialArray(
            allRows,
            stripUnknown
          );

          const vocabularyIds = _.uniq(
            vocabularyFieldRows.map((fieldRow): string => fieldRow.vocabularyId)
          );

          const {
            definitionsPerVocabularyId,
            markDefinitionsAsSynced,
          } = await this.dirtyDefinitionModel.getDirtyDefinitionsForSyncing(
            db,
            vocabularyIds,
            stripUnknown
          );

          const {
            vocabularyCategoryPerVocabularyId,
            markVocabularyCategoriesAsSynced,
          } = await this.dirtyVocabularyCategoryModel.getDirtyVocabularyCategoryForSyncing(
            db,
            vocabularyIds,
            stripUnknown
          );

          const {
            vocabularyWritingPerVocabularyId,
            markVocabularyWritingsAsSynced,
          } = await this.dirtyVocabularyWritingModel.getDirtyVocabularyWritingsForSyncing(
            db,
            vocabularyIds,
            stripUnknown
          );

          const vocabularyList = vocabularyRows.map(
            (vocabularyRow): DeepPartial<Vocabulary> => {
              const vocabularyId = assertExists(
                vocabularyRow.vocabularyId,
                'vocabularyId should not be null or undefined'
              );

              return this.vocabularyRowConverter.convertToPartialVocabulary(
                vocabularyRow,
                definitionsPerVocabularyId[vocabularyId],
                vocabularyCategoryPerVocabularyId[vocabularyId],
                vocabularyWritingPerVocabularyId[vocabularyId],
                []
              );
            }
          );

          const vocabularyIdSetIdPairs: readonly ReadonlyTuple<
            string,
            string
          >[] = vocabularyRows
            .map(
              (vocabularyRow): [undefined | string, undefined | string] => {
                return [vocabularyRow.vocabularyId, vocabularyRow.setId];
              }
            )
            .filter(
              (pair): pair is [string, string] =>
                typeof pair[0] !== 'undefined' && typeof pair[1] !== 'undefined'
            );

          const markVocabularyListAsSynced = (
            tx: Transaction,
            syncedVocabularyIds: readonly string[]
          ): void => {
            markVocabularyCategoriesAsSynced(tx, syncedVocabularyIds);
            markVocabularyWritingsAsSynced(tx, syncedVocabularyIds);
            markDefinitionsAsSynced(tx, syncedVocabularyIds);

            this.deleteDirtyFields(
              tx,
              vocabularyFieldRows.filter(
                (row): boolean =>
                  _.includes(syncedVocabularyIds, row.vocabularyId)
              ),
              { withState: FieldState.SYNCING }
            );
          };

          resolve({
            vocabularyList,
            vocabularyIdSetIdPairs,
            markVocabularyListAsSynced,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertOrReplaceDirtyVocabularyField(
    tx: Transaction,
    vocabularyId: string,
    fieldName: string
  ): void {
    const fieldRow = this.prepareDirtyVocabularyFieldsForInsert(
      vocabularyId,
      fieldName
    );

    const query = squel
      .insertOrReplace()
      .into(TableName.DIRTY_VOCABULARY_FIELD)
      .setFields(fieldRow)
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public insertOrReplaceDirtyVocabularyFields(
    tx: Transaction,
    vocabularyId: string,
    fieldNames: readonly string[]
  ): void {
    fieldNames.forEach(
      (fieldName): void => {
        this.insertOrReplaceDirtyVocabularyField(tx, vocabularyId, fieldName);
      }
    );
  }

  public deleteDirtyField(
    tx: Transaction,
    fieldRow: Pick<DirtyVocabularyFieldRow, 'vocabularyId' | 'fieldName'>,
    conditions: { withState: FieldState }
  ): void {
    const query = squel
      .delete()
      .from(TableName.DIRTY_VOCABULARY_FIELD)
      .where('vocabularyId = ?', fieldRow.vocabularyId)
      .where('fieldName = ?', fieldRow.fieldName)
      .where('fieldState = ?', conditions.withState)
      .toParam();
    tx.executeSql(query.text, query.values);
  }

  public deleteDirtyFields(
    tx: Transaction,
    fieldRows: readonly Pick<
      DirtyVocabularyFieldRow,
      'vocabularyId' | 'fieldName'
    >[],
    conditions: { withState: FieldState }
  ): void {
    fieldRows.forEach(
      (fieldRow): void => {
        this.deleteDirtyField(tx, fieldRow, conditions);
      }
    );
  }

  public transitionFieldState(
    tx: Transaction,
    fieldRow: Pick<DirtyVocabularyFieldRow, 'vocabularyId' | 'fieldName'>,
    transition: { toState: FieldState }
  ): void {
    const { vocabularyId, fieldName } = fieldRow;

    const query = squel
      .update()
      .table(TableName.DIRTY_VOCABULARY_FIELD)
      .where('vocabularyId = ?', vocabularyId)
      .where('fieldName = ?', fieldName)
      .setFields({ fieldState: transition.toState })
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public transitionFieldStates(
    tx: Transaction,
    fieldRows: readonly Pick<
      DirtyVocabularyFieldRow,
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

  private prepareDirtyVocabularyFieldsForInsert(
    vocabularyId: string,
    fieldName: string
  ): DirtyVocabularyFieldRow {
    return this.dirtyFieldRowPreparer.prepareInsert(
      vocabularyId,
      fieldName,
      FieldState.TO_BE_SYNCED
    );
  }
}
