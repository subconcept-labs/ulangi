/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { Result, SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Set } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { SetRowConverter } from '../converters/SetRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { DirtySetFieldRow } from '../interfaces/DirtySetFieldRow';
import { IncompatibleSetRow } from '../interfaces/IncompatibleSetRow';
import { DirtySetFieldRowPreparer } from '../preparers/DirtySetFieldRowPreparer';
import { DirtySetFieldRowResolver } from '../resolvers/DirtySetFieldRowResolver';
import { SetRowResolver } from '../resolvers/SetRowResolver';
import { DirtySetExtraDataModel } from './DirtySetExtraDataModel';

export class DirtySetModel {
  private setRowResolver = new SetRowResolver();
  private setRowConverter = new SetRowConverter();
  private dirtyFieldRowResolver = new DirtySetFieldRowResolver();
  private dirtyFieldRowPreparer = new DirtySetFieldRowPreparer();

  private dirtySetExtraDataModel: DirtySetExtraDataModel;

  public constructor(dirtySetExtraDataModel: DirtySetExtraDataModel) {
    this.dirtySetExtraDataModel = dirtySetExtraDataModel;
  }

  public getDirtySetsForSyncing(
    db: SQLiteDatabase,
    limit: number,
    stripUnknown: boolean
  ): Promise<{
    setList: readonly DeepPartial<Set>[];
    markSetsAsSynced: (
      tx: Transaction,
      syncedSetIds: readonly string[]
    ) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          // Get all dirty fields per set
          const fieldQuery = squel
            .select()
            .from(TableName.DIRTY_SET_FIELD)
            .field('GROUP_CONCAT(fieldName) as fieldNames')
            .field('GROUP_CONCAT(createdAt) as creationTimestamps')
            .field('GROUP_CONCAT(updatedAt) as updateTimestamps')
            .field('GROUP_CONCAT(fieldState) as fieldStates')
            .field('setId')
            .group('setId')
            .limit(limit)
            .toParam();

          const result = await db.executeSql(
            fieldQuery.text,
            fieldQuery.values
          );
          const fieldsPerSetId: [
            string,
            string[],
            string[],
            string[],
            string[]
          ][] = [];
          for (let i = 0; i < result.rows.length; ++i) {
            const item = result.rows[i];
            fieldsPerSetId.push([
              item.setId,
              item.fieldNames.split(','),
              item.creationTimestamps.split(','),
              item.updateTimestamps.split(','),
              item.fieldStates.split(','),
            ]);
          }

          const unresolvedFieldRows = _.flatMap(
            fieldsPerSetId,
            ([
              setId,
              fieldNames,
              creationTimestamps,
              updateTimestamps,
              fieldStates,
            ]): object[] => {
              return fieldNames.map(
                (fieldName, index): object => {
                  return {
                    setId,
                    fieldName,
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

          // Mark as syncing
          await db.transaction(
            (tx): void =>
              this.transitionFieldStates(
                tx,
                fieldRows.map(
                  (fieldRow): Pick<DirtySetFieldRow, 'setId' | 'fieldName'> => {
                    return {
                      setId: fieldRow.setId,
                      fieldName: fieldRow.fieldName,
                    };
                  }
                ),
                { toState: FieldState.SYNCING }
              )
          );

          // Get values of the dirty fields
          const results: Result[] = await Promise.all(
            fieldsPerSetId.map(
              ([setId, fieldNames]): Promise<Result> => {
                const query = squel
                  .select()
                  .from(TableName.SET)
                  .field('setId')
                  .fields(fieldNames)
                  .where('setId = ?', setId)
                  .limit(1)
                  .toParam();
                return db.executeSql(query.text, query.values);
              }
            )
          );

          const setIds = _.uniq(
            fieldRows.map((fieldRow): string => fieldRow.setId)
          );

          const {
            setExtraDataPerSetId,
            markSetExtraDataAsSynced,
          } = await this.dirtySetExtraDataModel.getDirtyExtraDataForSyncing(
            db,
            setIds,
            true
          );

          const allRows = _.flatMap(
            results,
            (result): readonly any[] => {
              return result.rows;
            }
          );

          const setRows = this.setRowResolver.resolvePartialArray(
            allRows,
            stripUnknown
          );

          const setList = setRows.map(
            (setRow): DeepPartial<Set> => {
              const setId = assertExists(
                setRow.setId,
                'setId should not be null or undefined'
              );
              const extraData = setExtraDataPerSetId[setId];
              return this.setRowConverter.convertToPartialSet(
                setRow,
                extraData
              );
            }
          );

          const markSetsAsSynced = (
            tx: Transaction,
            syncedSetIds: readonly string[]
          ): void => {
            this.deleteDirtyFields(
              tx,
              fieldRows.filter(
                (row): boolean => {
                  return _.includes(syncedSetIds, row.setId);
                }
              ),
              {
                withState: FieldState.SYNCING,
              }
            );

            markSetExtraDataAsSynced(tx, syncedSetIds);
          };

          resolve({
            setList,
            markSetsAsSynced,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertOrReplaceDirtyField(
    tx: Transaction,
    setId: string,
    fieldName: string
  ): void {
    const fieldRow = this.prepareDirtyFieldForInsert(setId, fieldName);

    const query = squel
      .insertOrReplace()
      .into(TableName.DIRTY_SET_FIELD)
      .setFields(fieldRow)
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public insertOrReplaceDirtyFields(
    tx: Transaction,
    setId: string,
    fieldNames: readonly string[]
  ): void {
    fieldNames.forEach(
      (fieldName): void => {
        this.insertOrReplaceDirtyField(tx, setId, fieldName);
      }
    );
  }

  public transitionFieldState(
    tx: Transaction,
    fieldRow: Pick<DirtySetFieldRow, 'setId' | 'fieldName'>,
    transition: { toState: FieldState }
  ): void {
    const { setId, fieldName } = fieldRow;
    const query = squel
      .update()
      .table(TableName.DIRTY_SET_FIELD)
      .where('setId = ?', setId)
      .where('fieldName = ?', fieldName)
      .setFields({ fieldState: transition.toState })
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public transitionFieldStates(
    tx: Transaction,
    fieldRows: readonly Pick<DirtySetFieldRow, 'setId' | 'fieldName'>[],
    transition: { toState: FieldState }
  ): void {
    fieldRows.forEach(
      (fieldRow): void => this.transitionFieldState(tx, fieldRow, transition)
    );
  }

  public deleteDirtyField(
    tx: Transaction,
    fieldRow: Pick<DirtySetFieldRow, 'setId' | 'fieldName'>,
    conditions: { withState: FieldState }
  ): void {
    const query = squel
      .delete()
      .from(TableName.DIRTY_SET_FIELD)
      .where('setId = ?', fieldRow.setId)
      .where('fieldName = ?', fieldRow.fieldName)
      .where('fieldState = ?', conditions.withState)
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public deleteDirtyFields(
    tx: Transaction,
    fieldRows: readonly Pick<DirtySetFieldRow, 'setId' | 'fieldName'>[],
    conditions: { withState: FieldState }
  ): void {
    fieldRows.forEach(
      (fieldRow): void => {
        this.deleteDirtyField(tx, fieldRow, conditions);
      }
    );
  }

  public upsertIncompatibleSet(
    tx: Transaction,
    incompatibleSetRow: IncompatibleSetRow
  ): void {
    const setId = incompatibleSetRow.setId;
    // Omit all fields shouldn't be updated if the record already existed
    const updateFields = _.omit(incompatibleSetRow, ['setId']);

    const insertOrIgnoreQuery = squel
      .insertOrIgnore()
      .into(TableName.INCOMPATIBLE_SET)
      .setFields(incompatibleSetRow)
      .toParam();

    const updateQuery = squel
      .update()
      .table(TableName.INCOMPATIBLE_SET)
      .setFields(updateFields)
      .where('setId = ?', setId)
      .toParam();

    tx.executeSql(updateQuery.text, updateQuery.values);
    tx.executeSql(insertOrIgnoreQuery.text, insertOrIgnoreQuery.values);
  }

  private prepareDirtyFieldForInsert(
    setId: string,
    fieldName: string
  ): DirtySetFieldRow {
    return this.dirtyFieldRowPreparer.prepareInsert(
      setId,
      fieldName,
      FieldState.TO_BE_SYNCED
    );
  }
}
