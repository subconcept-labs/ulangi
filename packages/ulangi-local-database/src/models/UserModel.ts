/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { User } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { UserRowConverter } from '../converters/UserRowConverter';
import { DatabaseEvent } from '../enums/DatabaseEvent';
import { TableName } from '../enums/TableName';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { UserRow } from '../interfaces/UserRow';
import { UserExtraDataModel } from '../models/UserExtraDataModel';
import { UserRowPreparer } from '../preparers/UserRowPreparer';
import { UserRowResolver } from '../resolvers/UserRowResolver';
import { DirtyUserModel } from './DirtyUserModel';

export class UserModel {
  private userRowResolver = new UserRowResolver();
  private userRowConverter = new UserRowConverter();
  private userRowPreparer = new UserRowPreparer();

  private userExtraDataModel: UserExtraDataModel;
  private dirtyUserModel: DirtyUserModel;
  private databaseEventBus: DatabaseEventBus;

  public constructor(
    userExtraDataModel: UserExtraDataModel,
    dirtyUserModel: DirtyUserModel,
    databaseEventBus: DatabaseEventBus
  ) {
    this.userExtraDataModel = userExtraDataModel;
    this.dirtyUserModel = dirtyUserModel;
    this.databaseEventBus = databaseEventBus;
  }

  public getUserById(
    db: SQLiteDatabase,
    userId: string,
    stripUnknown: boolean
  ): Promise<null | { user: User }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.USER)
            .where('userId = ?', userId)
            .toParam();
          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length === 1) {
            const item = result.rows[0];

            const userRow = this.userRowResolver.resolve(item, stripUnknown);

            const user = await this.getCompleteUserByRow(
              db,
              userRow,
              stripUnknown
            );

            resolve({ user });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public userExists(db: SQLiteDatabase, userId: string): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.USER)
            .where('userId = ?', userId)
            .limit(1)
            .toParam();

          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertUser(
    tx: Transaction,
    user: User,
    source: 'local' | 'remote'
  ): void {
    if (source === 'local') {
      throw new Error('Cannot insert user from local');
    }

    const userRow = this.userRowPreparer.prepareInsert(user, source);

    const query = squel
      .insert()
      .into(TableName.USER)
      .setFields(userRow)
      .toParam();

    tx.executeSql(query.text, query.values);

    this.userExtraDataModel.upsertMultipleExtraData(
      tx,
      user.extraData,
      user.userId,
      source
    );
  }

  public updateUser(
    tx: Transaction,
    user: DeepPartial<User>,
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    const userId = assertExists(user.userId);

    const userRow = this.userRowPreparer.prepareUpdate(user, source);

    const updateFields =
      source === 'local'
        ? // Only updatedAt is allow when update from local
          _.pick(userRow, ['updatedAt'])
        : _.omit(userRow, ['userId', 'createdAt']);

    if (_.isEmpty(updateFields)) {
      return;
    } else {
      // Only update the fields that are not dirty
      if (source === 'remote') {
        const queries = _.map(
          updateFields,
          (fieldValue, fieldName): squel.ParamString => {
            return squel
              .update()
              .set(fieldName, fieldValue)
              .table(TableName.USER)
              .where('userId = ?', userId)
              .where(
                'NOT EXISTS ?',
                squel
                  .select()
                  .from(TableName.DIRTY_USER_FIELD)
                  .where('userId = ?', userId)
                  .where('fieldName = ?', fieldName)
              )
              .toParam();
          }
        );

        queries.forEach(
          (query): void => {
            tx.executeSql(query.text, query.values);
          }
        );
      } else {
        const query = squel
          .update()
          .table(TableName.USER)
          .setFields(updateFields)
          .where('userId = ?', userId)
          .toParam();
        tx.executeSql(query.text, query.values);

        // Mark fields as dirty
        if (source === 'local') {
          this.dirtyUserModel.insertOrReplaceDirtyUserFields(
            tx,
            userId,
            _.keys(_.omit(userRow, 'userId'))
          );
        }

        if (
          _.get(options, 'doNotPublishEvent') !== true &&
          source === 'local'
        ) {
          tx.onCommitted(
            (): void => {
              this.databaseEventBus.publish(
                DatabaseEvent.USER_UPDATED_FROM_LOCAL
              );
            }
          );
        }
      }
    }

    if (typeof user.extraData !== 'undefined') {
      this.userExtraDataModel.upsertMultipleExtraData(
        tx,
        user.extraData,
        assertExists(user.userId),
        source
      );
    }
  }

  private async getCompleteUserByRow(
    db: SQLiteDatabase,
    userRow: UserRow,
    stripUnknown: boolean
  ): Promise<User> {
    const {
      userExtraData,
    } = await this.userExtraDataModel.getExtraDataByUserId(
      db,
      userRow.userId,
      stripUnknown
    );

    const user = this.userRowConverter.convertToUser(userRow, userExtraData);

    return user;
  }
}
