/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as squel from 'squel';

import { UserExtraDataRowConverter } from '../converters/UserExtraDataRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { UserExtraDataRowResolver } from '../resolvers/UserExtraDataRowResolver';

export class DirtyUserExtraDataModel {
  private userExtraDataRowResolver = new UserExtraDataRowResolver();
  private userExtraDataRowConverter = new UserExtraDataRowConverter();

  public getDirtyExtraDataForSyncing(
    db: SQLiteDatabase,
    userId: string,
    stripUnknown: boolean
  ): Promise<{
    userExtraData: readonly UserExtraDataItem[];
    markUserExtraDataAsSynced: (tx: Transaction) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await db.transaction(
            (tx): void =>
              this.transitionFieldState(tx, userId, {
                fromAllStatesExcept: FieldState.SYNCED,
                toState: FieldState.SYNCING,
              })
          );

          // Get values of the dirty fields
          const query = squel
            .select()
            .from(TableName.USER_EXTRA_DATA)
            .where('userId = ?', userId)
            .where('fieldState != ?', FieldState.SYNCED)
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

          const markUserExtraDataAsSynced = (tx: Transaction): void => {
            this.transitionFieldState(tx, userId, {
              fromState: FieldState.SYNCING,
              toState: FieldState.SYNCED,
            });
          };

          resolve({
            userExtraData,
            markUserExtraDataAsSynced,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public transitionFieldState(
    tx: Transaction,
    userId: string,
    transition: {
      fromState?: FieldState;
      fromAllStatesExcept?: FieldState;
      toState: FieldState;
    }
  ): void {
    let query;
    if (typeof transition.fromAllStatesExcept !== 'undefined') {
      query = squel
        .update()
        .table(TableName.USER_EXTRA_DATA)
        .where('userId = ?', userId)
        .where('fieldState != ?', transition.fromAllStatesExcept)
        .setFields({ fieldState: transition.toState })
        .toParam();
    } else if (typeof transition.fromState !== 'undefined') {
      query = squel
        .update()
        .table(TableName.USER_EXTRA_DATA)
        .where('userId = ?', userId)
        .where('fieldState = ?', transition.fromState)
        .setFields({ fieldState: transition.toState })
        .toParam();
    } else {
      query = squel
        .update()
        .table(TableName.USER_EXTRA_DATA)
        .where('userId = ?', userId)
        .setFields({ fieldState: transition.toState })
        .toParam();
    }

    tx.executeSql(query.text, query.values);
  }
}
