/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as squel from 'squel';

import { SetExtraDataRowConverter } from '../converters/SetExtraDataRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { SetExtraDataRowPreparer } from '../preparers/SetExtraDataRowPreparer';
import { SetExtraDataRowResolver } from '../resolvers/SetExtraDataRowResolver';

export class SetExtraDataModel {
  private setExtraDataRowResolver = new SetExtraDataRowResolver();
  private setExtraDataRowPreparer = new SetExtraDataRowPreparer();
  private setExtraDataRowConverter = new SetExtraDataRowConverter();

  public getExtraDataBySetId(
    db: SQLiteDatabase,
    setId: string,
    stripUnknown: boolean
  ): Promise<{
    setExtraData: readonly SetExtraDataItem[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.SET_EXTRA_DATA)
            .where('setId = ?', setId)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          const setExtraDataRows = this.setExtraDataRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const setExtraData = this.setExtraDataRowConverter.convertToSetExtraDataItems(
            setExtraDataRows,
            stripUnknown
          );

          resolve({ setExtraData });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getExtraDataBySetIds(
    db: SQLiteDatabase,
    setIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    setExtraDataPerSetId: { [P in string]: readonly SetExtraDataItem[] };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.SET_EXTRA_DATA)
            .where(
              `setId IN (${setIds.map((): string => '?').join(',')})`,
              ...setIds
            )
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          const setExtraDataRows = this.setExtraDataRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          // Group rows by setId.
          // groups here is an object.
          const setExtraDataRowsPerSetId = _.groupBy(
            setExtraDataRows,
            (row): string => row.setId
          );

          const setExtraDataPerSetId = _.mapValues(
            setExtraDataRowsPerSetId,
            (rows): readonly SetExtraDataItem[] => {
              return this.setExtraDataRowConverter.convertToSetExtraDataItems(
                rows,
                stripUnknown
              );
            }
          );

          resolve({ setExtraDataPerSetId });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertExtraData(
    tx: Transaction,
    extraDataItem: DeepPartial<SetExtraDataItem>,
    setId: string,
    source: 'local' | 'remote'
  ): void {
    const extraDataRow = this.setExtraDataRowPreparer.prepareUpsert(
      extraDataItem,
      setId,
      source
    );

    const dataName = extraDataRow.dataName;
    // Omit fields should not be updated
    const updateFields =
      source === 'local'
        ? _.omit(extraDataRow, [
            'setId',
            'dataName',
            'createdAt',
            'firstSyncedAt',
            'lastSyncedAt',
          ])
        : _.omit(extraDataRow, ['setId', 'dataName', 'createdAt']);

    const insertOrIgnoreQuery = squel
      .insertOrIgnore()
      .into(TableName.SET_EXTRA_DATA)
      .setFields(extraDataRow)
      .toParam();

    // Only update if row is not dirty
    let updateQuery;
    if (source === 'remote') {
      updateQuery = squel
        .update()
        .table(TableName.SET_EXTRA_DATA)
        .setFields(updateFields)
        .where('setId = ?', setId)
        .where('dataName = ?', dataName)
        .where('fieldState = ?', FieldState.SYNCED)
        .toParam();
    } else {
      updateQuery = squel
        .update()
        .table(TableName.SET_EXTRA_DATA)
        .setFields(updateFields)
        .where('setId = ?', setId)
        .where('dataName = ?', dataName)
        .toParam();
    }

    tx.executeSql(updateQuery.text, updateQuery.values);
    tx.executeSql(insertOrIgnoreQuery.text, insertOrIgnoreQuery.values);
  }

  public upsertMultipleExtraData(
    tx: Transaction,
    extraDataSetIdPairs: readonly [DeepPartial<SetExtraDataItem>, string][],
    source: 'local' | 'remote'
  ): void {
    extraDataSetIdPairs.forEach(
      ([extraData, setId]): void => {
        this.upsertExtraData(tx, extraData, setId, source);
      }
    );
  }
}
