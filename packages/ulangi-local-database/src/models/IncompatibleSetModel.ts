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
import { IncompatibleSetRowPreparer } from '../preparers/IncompatibleSetRowPreparer';
import { IncompatibleSetRowResolver } from '../resolvers/IncompatibleSetRowResolver';

export class IncompatibleSetModel {
  private incompatibleSetRowResolver = new IncompatibleSetRowResolver();
  private IncompatibleSetRowPreparer = new IncompatibleSetRowPreparer();

  public getIncompatibleSetIdsForRedownload(
    db: SQLiteDatabase,
    currentCommonVersion: string,
    limit: number,
    stripUnknown: boolean
  ): Promise<{
    setIds: readonly string[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.INCOMPATIBLE_SET)
            .where('lastTriedCommonVersion != ?', currentCommonVersion)
            .limit(limit)
            .toParam();

          const result = await db.executeSql(query.text, query.values);
          const incompatibleSetRows = this.incompatibleSetRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );
          const setIds = incompatibleSetRows.map((row): string => row.setId);

          resolve({ setIds });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertIncompatibleSet(
    tx: Transaction,
    setId: string,
    currentCommonVersion: string
  ): void {
    const incompatibleSetRow = this.IncompatibleSetRowPreparer.prepareUpsert(
      setId,
      currentCommonVersion
    );

    // Omit all fields shouldn't be updated
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

  public upsertIncompatibleSets(
    tx: Transaction,
    setIds: readonly string[],
    currentCommonVersion: string
  ): void {
    setIds.forEach(
      (setId): void => {
        this.upsertIncompatibleSet(tx, setId, currentCommonVersion);
      }
    );
  }

  public deleteIncompatibleSet(tx: Transaction, setId: string): void {
    const query = squel
      .delete()
      .from(TableName.INCOMPATIBLE_SET)
      .where('setId = ?', setId)
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public deleteIncompatibleSets(
    tx: Transaction,
    setIds: readonly string[]
  ): void {
    setIds.forEach(
      (setId): void => {
        this.deleteIncompatibleSet(tx, setId);
      }
    );
  }
}
