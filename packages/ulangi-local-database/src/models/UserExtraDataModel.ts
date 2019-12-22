/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as squel from 'squel';

import { UserExtraDataRowConverter } from '../converters/UserExtraDataRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { UserExtraDataRow } from '../interfaces/UserExtraDataRow';
import { UserExtraDataRowPreparer } from '../preparers/UserExtraDataRowPreparer';
import { UserExtraDataRowResolver } from '../resolvers/UserExtraDataRowResolver';

export class UserExtraDataModel {
  private userExtraDataRowResolver = new UserExtraDataRowResolver();
  private userExtraDataRowPreparer = new UserExtraDataRowPreparer();
  private userExtraDataRowConverter = new UserExtraDataRowConverter();

  public getExtraDataByUserId(
    db: SQLiteDatabase,
    userId: string,
    stripUnknown: boolean
  ): Promise<{
    userExtraData: readonly UserExtraDataItem[];
    userExtraDataRows: readonly UserExtraDataRow[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.USER_EXTRA_DATA)
            .where('userId = ?', userId)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          const userExtraDataRows = this.userExtraDataRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const userExtraData = this.userExtraDataRowConverter.convertToUserExtraDataItems(
            userExtraDataRows,
            stripUnknown
          );

          resolve({ userExtraData, userExtraDataRows });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertExtraData(
    tx: Transaction,
    extraDataItem: DeepPartial<UserExtraDataItem>,
    userId: string,
    source: 'local' | 'remote'
  ): void {
    const extraDataRow = this.userExtraDataRowPreparer.prepareUpsert(
      extraDataItem,
      userId,
      source
    );

    const dataName = extraDataRow.dataName;
    // Omit fields should not be updated
    const updateFields =
      source === 'local'
        ? _.omit(extraDataRow, [
            'userId',
            'dataName',
            'createdAt',
            'firstSyncedAt',
            'lastSyncedAt',
          ])
        : _.omit(extraDataRow, ['userId', 'dataName', 'createdAt']);

    const insertOrIgnoreQuery = squel
      .insertOrIgnore()
      .into(TableName.USER_EXTRA_DATA)
      .setFields(extraDataRow)
      .toParam();

    // Only update if row is not dirty
    let updateQuery;
    if (source === 'remote') {
      updateQuery = squel
        .update()
        .table(TableName.USER_EXTRA_DATA)
        .setFields(updateFields)
        .where('userId = ?', userId)
        .where('dataName = ?', dataName)
        .where('fieldState = ?', FieldState.SYNCED)
        .toParam();
    } else {
      updateQuery = squel
        .update()
        .table(TableName.USER_EXTRA_DATA)
        .setFields(updateFields)
        .where('userId = ?', userId)
        .where('dataName = ?', dataName)
        .toParam();
    }

    tx.executeSql(updateQuery.text, updateQuery.values);
    tx.executeSql(insertOrIgnoreQuery.text, insertOrIgnoreQuery.values);
  }

  public upsertMultipleExtraData(
    tx: Transaction,
    extraDataList: readonly DeepPartial<UserExtraDataItem>[],
    userId: string,
    source: 'local' | 'remote'
  ): void {
    extraDataList.forEach(
      (extraDataItem): void => {
        this.upsertExtraData(tx, extraDataItem, userId, source);
      }
    );
  }
}
