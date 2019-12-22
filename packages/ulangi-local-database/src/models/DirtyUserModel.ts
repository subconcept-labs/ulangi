/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { User } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { UserRowConverter } from '../converters/UserRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { DirtyUserFieldRow } from '../interfaces/DirtyUserFieldRow';
import { DirtyUserExtraDataModel } from '../models/DirtyUserExtraDataModel';
import { DirtyUserFieldRowPreparer } from '../preparers/DirtyUserFieldRowPreparer';
import { DirtyUserFieldRowResolver } from '../resolvers/DirtyUserFieldRowResolver';
import { UserRowResolver } from '../resolvers/UserRowResolver';

export class DirtyUserModel {
  private userRowResolver = new UserRowResolver();
  private userRowConverter = new UserRowConverter();
  private dirtyFieldRowPreparer = new DirtyUserFieldRowPreparer();
  private dirtyFieldRowResolver = new DirtyUserFieldRowResolver();

  private dirtyUserExtraDataModel: DirtyUserExtraDataModel;

  public constructor(dirtyUserExtraDataModel: DirtyUserExtraDataModel) {
    this.dirtyUserExtraDataModel = dirtyUserExtraDataModel;
  }

  public getDirtyUserForSyncing(
    db: SQLiteDatabase,
    userId: string,
    stripUnknown: boolean
  ): Promise<{
    user: null | DeepPartial<User>;
    markUserAsSynced: (tx: Transaction) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          // Get all dirty fields per set
          const fieldQuery = squel
            .select()
            .from(TableName.DIRTY_USER_FIELD)
            .field('GROUP_CONCAT(fieldName) as fieldNames')
            .field('GROUP_CONCAT(createdAt) as creationTimestamps')
            .field('GROUP_CONCAT(updatedAt) as updateTimestamps')
            .field('GROUP_CONCAT(fieldState) as fieldStates')
            .field('userId')
            .group('userId')
            .having('userId = ?', userId)
            .limit(1)
            .toParam();

          const fieldResult = await db.executeSql(
            fieldQuery.text,
            fieldQuery.values
          );
          const firstRow = _.first(fieldResult.rows);

          if (typeof firstRow === 'undefined') {
            resolve({ user: null, markUserAsSynced: _.noop });
          } else {
            const [
              fieldNames,
              creationTimestamps,
              updateTimestamps,
              fieldStates,
            ]: [string[], string[], string[], string[]] = [
              firstRow.fieldNames.split(','),
              firstRow.creationTimestamps.split(','),
              firstRow.updateTimestamps.split(','),
              firstRow.fieldStates.split(','),
            ];

            const unresolvedFieldRows = fieldNames.map(
              (fieldName, index): object => {
                return {
                  userId,
                  fieldName,
                  createdAt: creationTimestamps[index],
                  updatedAt: updateTimestamps[index],
                  fieldState: fieldStates[index],
                };
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
                    (
                      fieldRow
                    ): Pick<DirtyUserFieldRow, 'userId' | 'fieldName'> => {
                      return {
                        userId,
                        fieldName: fieldRow.fieldName,
                      };
                    }
                  ),
                  { toState: FieldState.SYNCING }
                )
            );

            // Get values of the dirty fields
            const query = squel
              .select()
              .from(TableName.USER)
              .field('userId')
              .fields(fieldNames)
              .where('userId = ?', userId)
              .limit(1)
              .toParam();

            const result = await db.executeSql(query.text, query.values);

            const userRow = this.userRowResolver.resolvePartial(
              _.first(result.rows),
              stripUnknown
            );

            const {
              userExtraData,
              markUserExtraDataAsSynced,
            } = await this.dirtyUserExtraDataModel.getDirtyExtraDataForSyncing(
              db,
              userId,
              true
            );

            const user = this.userRowConverter.convertToPartialUser(
              userRow,
              userExtraData
            );

            const markUserAsSynced = (tx: Transaction): void => {
              markUserExtraDataAsSynced(tx);

              this.deleteDirtyFields(tx, fieldRows, {
                withState: FieldState.SYNCING,
              });
            };

            resolve({
              user,
              markUserAsSynced,
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public deleteDirtyField(
    tx: Transaction,
    fieldRow: Pick<DirtyUserFieldRow, 'userId' | 'fieldName'>,
    conditions: { withState: FieldState }
  ): void {
    const query = squel
      .delete()
      .from(TableName.DIRTY_USER_FIELD)
      .where('userId = ?', fieldRow.userId)
      .where('fieldName = ?', fieldRow.fieldName)
      .where('fieldState = ?', conditions.withState)
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public deleteDirtyFields(
    tx: Transaction,
    fieldRows: readonly Pick<DirtyUserFieldRow, 'userId' | 'fieldName'>[],
    conditions: { withState: FieldState }
  ): void {
    fieldRows.forEach(
      (fieldRow): void => {
        this.deleteDirtyField(tx, fieldRow, conditions);
      }
    );
  }

  public insertOrReplaceDirtyUserField(
    tx: Transaction,
    userId: string,
    fieldName: string
  ): void {
    const fieldRow = this.prepareDirtyUserFieldForInsert(userId, fieldName);
    const query = squel
      .insertOrReplace()
      .into(TableName.DIRTY_USER_FIELD)
      .setFields(fieldRow)
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public insertOrReplaceDirtyUserFields(
    tx: Transaction,
    userId: string,
    fieldNames: readonly string[]
  ): void {
    fieldNames.forEach(
      (fieldName): void => {
        this.insertOrReplaceDirtyUserField(tx, userId, fieldName);
      }
    );
  }

  public transitionFieldState(
    tx: Transaction,
    fieldRow: Pick<DirtyUserFieldRow, 'userId' | 'fieldName'>,
    transition: { toState: FieldState }
  ): void {
    const { userId, fieldName } = fieldRow;
    const query = squel
      .update()
      .table(TableName.DIRTY_USER_FIELD)
      .where('userId = ?', userId)
      .where('fieldName = ?', fieldName)
      .setFields({ fieldState: transition.toState })
      .toParam();

    tx.executeSql(query.text, query.values);
  }

  public transitionFieldStates(
    tx: Transaction,
    fieldRows: readonly Pick<DirtyUserFieldRow, 'userId' | 'fieldName'>[],
    transition: { toState: FieldState }
  ): void {
    fieldRows.forEach(
      (fieldRow): void => this.transitionFieldState(tx, fieldRow, transition)
    );
  }

  private prepareDirtyUserFieldForInsert(
    userId: string,
    fieldName: string
  ): DirtyUserFieldRow {
    return this.dirtyFieldRowPreparer.prepareInsert(
      userId,
      fieldName,
      FieldState.TO_BE_SYNCED
    );
  }
}
