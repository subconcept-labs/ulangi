/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { Result, SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { DefinitionRowConverter } from '../converters/DefinitionRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { DirtyDefinitionFieldRow } from '../interfaces/DirtyDefinitionFieldRow';
import { DirtyDefinitionFieldRowPreparer } from '../preparers/DirtyDefinitionFieldRowPreparer';
import { DefinitionRowResolver } from '../resolvers/DefinitionRowResolver';
import { DirtyDefinitionFieldRowResolver } from '../resolvers/DirtyDefinitionFieldRowResolver';

export class DirtyDefinitionModel {
  private definitionRowResolver = new DefinitionRowResolver();
  private definitionRowConverter = new DefinitionRowConverter();
  private dirtyFieldRowResolver = new DirtyDefinitionFieldRowResolver();
  private dirtyFieldRowPreparer = new DirtyDefinitionFieldRowPreparer();

  public getDirtyDefinitionsForSyncing(
    db: SQLiteDatabase,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    definitionsPerVocabularyId: {
      [P in string]: readonly DeepPartial<Definition>[]
    };
    markDefinitionsAsSynced: (
      tx: Transaction,
      syncedVocabularyIds: readonly string[]
    ) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.DIRTY_DEFINITION_FIELD, 'F')
            .join(TableName.DEFINITION, 'D', 'D.definitionId = F.definitionId')
            .field('GROUP_CONCAT(F.fieldName) as fieldNames')
            .field('GROUP_CONCAT(F.createdAt) as creationTimestamps')
            .field('GROUP_CONCAT(F.updatedAt) as updateTimestamps')
            .field('GROUP_CONCAT(F.fieldState) as fieldStates')
            .field('F.definitionId')
            .where('D.vocabularyId IN ?', vocabularyIds)
            .group('F.definitionId')
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const fieldsPerDefinitionId: [
            string,
            string[],
            string[],
            string[],
            string[]
          ][] = [];
          for (let i = 0; i < result.rows.length; ++i) {
            const item = result.rows[i];
            fieldsPerDefinitionId.push([
              item.definitionId,
              item.fieldNames.split(','),
              item.creationTimestamps.split(','),
              item.updateTimestamps.split(','),
              item.fieldStates.split(','),
            ]);
          }

          const unresolvedFieldRows = _.flatMap(
            fieldsPerDefinitionId,
            ([
              definitionId,
              fieldNames,
              creationTimestamps,
              updateTimestamps,
              fieldStates,
            ]): object[] => {
              return fieldNames.map(
                (fieldName, index): object => {
                  return {
                    definitionId,
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
                    DirtyDefinitionFieldRow,
                    'definitionId' | 'fieldName'
                  > => {
                    return {
                      definitionId: fieldRow.definitionId,
                      fieldName: fieldRow.fieldName,
                    };
                  }
                ),
                { toState: FieldState.SYNCING }
              )
          );

          // Get values of the dirty fields
          const results: Result[] = await Promise.all(
            fieldsPerDefinitionId.map(
              ([definitionId, fieldNames]): Promise<Result> => {
                const query = squel
                  .select()
                  .from(TableName.DEFINITION)
                  .field('definitionId')
                  .field('vocabularyId')
                  .fields(fieldNames)
                  .where('definitionId = ?', definitionId)
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

          const definitionRows = this.definitionRowResolver.resolvePartialArray(
            allRows,
            stripUnknown
          );

          // Group by vocabularyId
          const definitionRowsPerVocabularyId = _.groupBy(
            definitionRows,
            (definitionRow): string => assertExists(definitionRow.vocabularyId)
          );

          const definitionsPerVocabularyId = _.mapValues(
            definitionRowsPerVocabularyId,
            (definitionRows): DeepPartial<Definition>[] => {
              return definitionRows.map(
                (definitionRow): DeepPartial<Definition> =>
                  this.definitionRowConverter.convertToPartialDefinition(
                    definitionRow,
                    []
                  )
              );
            }
          );

          const markDefinitionsAsSynced = (
            tx: Transaction,
            syncedVocabularyIds: readonly string[]
          ): void => {
            const syncedDefinitionIds = definitionRows
              .filter(
                (row): boolean =>
                  _.includes(syncedVocabularyIds, row.vocabularyId)
              )
              .map((row): string => assertExists(row.definitionId));

            this.deleteDirtyFields(
              tx,
              fieldRows
                .filter(
                  (fieldRow): boolean => {
                    return _.includes(
                      syncedDefinitionIds,
                      fieldRow.definitionId
                    );
                  }
                )
                .map(
                  (
                    fieldRow
                  ): Pick<
                    DirtyDefinitionFieldRow,
                    'definitionId' | 'fieldName'
                  > => {
                    return {
                      definitionId: fieldRow.definitionId,
                      fieldName: fieldRow.fieldName,
                    };
                  }
                ),
              {
                withState: FieldState.SYNCING,
              }
            );
          };

          resolve({ definitionsPerVocabularyId, markDefinitionsAsSynced });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public deleteDirtyField(
    tx: Transaction,
    fieldRow: Pick<DirtyDefinitionFieldRow, 'definitionId' | 'fieldName'>,
    conditions: { withState: FieldState }
  ): void {
    const query = squel
      .delete()
      .from(TableName.DIRTY_DEFINITION_FIELD)
      .where('definitionId = ?', fieldRow.definitionId)
      .where('fieldName = ?', fieldRow.fieldName)
      .where('fieldState = ?', conditions.withState)
      .toParam();
    tx.executeSql(query.text, query.values);
  }

  public deleteDirtyFields(
    tx: Transaction,
    fieldRows: readonly Pick<
      DirtyDefinitionFieldRow,
      'definitionId' | 'fieldName'
    >[],
    conditions: { withState: FieldState }
  ): void {
    fieldRows.forEach(
      (fieldRow): void => {
        this.deleteDirtyField(tx, fieldRow, conditions);
      }
    );
  }

  public insertOrReplaceDirtyFieldsIfDefinitionExists(
    tx: Transaction,
    definitionId: string,
    fieldNames: readonly string[]
  ): void {
    fieldNames.forEach(
      (fieldName): void => {
        this.insertOrReplaceDirtyFieldIfDefinitionExists(
          tx,
          definitionId,
          fieldName
        );
      }
    );
  }

  public insertOrReplaceDirtyFieldIfDefinitionExists(
    tx: Transaction,
    definitionId: string,
    fieldName: string
  ): void {
    const fieldRow = this.prepareDirtyFieldForInsert(definitionId, fieldName);

    const dirtyQuery = squel
      .insertOrReplace({ rawNesting: true })
      .into(TableName.DIRTY_DEFINITION_FIELD)
      .fromQuery(
        ['definitionId', 'fieldName', 'createdAt', 'updatedAt', 'fieldState'],
        squel
          .select({ rawNesting: true })
          .from(TableName.DEFINITION)
          .field('definitionId')
          .field(squel.rstr(`'${fieldName}'`))
          .field(squel.rstr(`${fieldRow.createdAt}`))
          .field(squel.rstr(`${fieldRow.updatedAt}`))
          .field(squel.rstr(`'${fieldRow.fieldState}'`))
          .where('definitionId = ?', definitionId)
      )
      .toParam();

    tx.executeSql(dirtyQuery.text, dirtyQuery.values);
  }

  public insertOrIgnoreDirtyField(
    tx: Transaction,
    definitionId: string,
    fieldName: string
  ): void {
    const fieldRow = this.prepareDirtyFieldForInsert(definitionId, fieldName);

    const dirtyQuery = squel
      .insertOrIgnore()
      .into(TableName.DIRTY_DEFINITION_FIELD)
      .setFields(fieldRow)
      .toParam();

    tx.executeSql(dirtyQuery.text, dirtyQuery.values);
  }

  public insertOrIgnoreDirtyFields(
    tx: Transaction,
    definitionId: string,
    fieldNames: readonly string[]
  ): void {
    fieldNames.forEach(
      (fieldName): void => {
        this.insertOrIgnoreDirtyField(tx, definitionId, fieldName);
      }
    );
  }

  public transitionFieldState(
    tx: Transaction,
    fieldRow: Pick<DirtyDefinitionFieldRow, 'definitionId' | 'fieldName'>,
    transition: { toState: FieldState }
  ): void {
    const { definitionId, fieldName } = fieldRow;
    const query = squel
      .update()
      .table(TableName.DIRTY_DEFINITION_FIELD)
      .where('definitionId = ?', definitionId)
      .where('fieldName = ?', fieldName)
      .setFields({ fieldState: transition.toState })
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public transitionFieldStates(
    tx: Transaction,
    fieldRows: readonly Pick<
      DirtyDefinitionFieldRow,
      'definitionId' | 'fieldName'
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
    definitionId: string,
    fieldName: string
  ): DirtyDefinitionFieldRow {
    return this.dirtyFieldRowPreparer.prepareInsert(
      definitionId,
      fieldName,
      FieldState.TO_BE_SYNCED
    );
  }
}
