/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as squel from 'squel';

import { SetExtraDataRowConverter } from '../converters/SetExtraDataRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { SetExtraDataRowResolver } from '../resolvers/SetExtraDataRowResolver';

export class DirtySetExtraDataModel {
  private setExtraDataRowResolver = new SetExtraDataRowResolver();
  private setExtraDataRowConverter = new SetExtraDataRowConverter();

  public getDirtyExtraDataForSyncing(
    db: SQLiteDatabase,
    setIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    setExtraDataPerSetId: { [P in string]: readonly SetExtraDataItem[] };
    markSetExtraDataAsSynced: (
      tx: Transaction,
      syncedSetIds: readonly string[]
    ) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await db.transaction(
            (tx): void =>
              this.transitionFieldStates(tx, setIds, {
                fromAllStatesExcept: FieldState.SYNCED,
                toState: FieldState.SYNCING,
              })
          );

          // Get values of the dirty fields
          const query = squel
            .select()
            .from(TableName.SET_EXTRA_DATA)
            .where(
              `setId IN (${setIds.map((): string => '?').join(',')})`,
              ...setIds
            )
            .where('fieldState != ?', FieldState.SYNCED)
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const setExtraDataRows = this.setExtraDataRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          // Group by setId
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

          const markSetExtraDataAsSynced = (
            tx: Transaction,
            syncedSetIds: readonly string[]
          ): void => {
            this.transitionFieldStates(tx, syncedSetIds, {
              fromState: FieldState.SYNCING,
              toState: FieldState.SYNCED,
            });
          };

          resolve({ setExtraDataPerSetId, markSetExtraDataAsSynced });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public transitionFieldState(
    tx: Transaction,
    setId: string,
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
        .table(TableName.SET_EXTRA_DATA)
        .where('setId = ?', setId)
        .where('fieldState != ?', transition.fromAllStatesExcept)
        .setFields({ fieldState: transition.toState })
        .toParam();
    } else if (typeof transition.fromState !== 'undefined') {
      query = squel
        .update()
        .table(TableName.SET_EXTRA_DATA)
        .where('setId = ?', setId)
        .where('fieldState = ?', transition.fromState)
        .setFields({ fieldState: transition.toState })
        .toParam();
    } else {
      query = squel
        .update()
        .table(TableName.SET_EXTRA_DATA)
        .where('setId = ?', setId)
        .setFields({ fieldState: transition.toState })
        .toParam();
    }

    tx.executeSql(query.text, query.values);
  }

  public transitionFieldStates(
    tx: Transaction,
    setIds: readonly string[],
    transition: {
      fromState?: FieldState;
      fromAllStatesExcept?: FieldState;
      toState: FieldState;
    }
  ): void {
    setIds.forEach(
      (setId): void => {
        this.transitionFieldState(tx, setId, transition);
      }
    );
  }
}
