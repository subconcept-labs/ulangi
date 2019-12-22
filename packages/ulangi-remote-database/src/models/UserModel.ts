/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { User } from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';

import { UserRowConverter } from '../converters/UserRowConverter';
import { TableName } from '../enums/TableName';
import { UserRow } from '../interfaces/UserRow';
import { UserExtraDataModel } from '../models/UserExtraDataModel';
import { UserRowPreparer } from '../preparers/UserRowPreparer';
import { UserRowResolver } from '../resolvers/UserRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class UserModel {
  private userRowResolver = new UserRowResolver();
  private userRowPreparer = new UserRowPreparer();
  private userRowConverter = new UserRowConverter();

  private userExtraDataModel: UserExtraDataModel;

  public constructor(userExtraDataModel: UserExtraDataModel) {
    this.userExtraDataModel = userExtraDataModel;
  }

  public getUserByIdAndAccessKey(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    accessKey: string,
    stripUnknown: boolean
  ): Promise<null | {
    user: User;
    shardId: number;
    password: string;
    accessKey: string;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.USER)
              .where({ userId, accessKey })
              .limit(1)
          );
          const first = _.first(result);
          if (typeof first === 'undefined') {
            resolve(null);
          } else {
            const userRow = this.userRowResolver.resolve(first, stripUnknown);
            const user = await this.getCompleteUserByRow(
              db,
              userRow,
              stripUnknown
            );

            resolve({
              user,
              shardId: userRow.shardId,
              password: userRow.password,
              accessKey: userRow.accessKey,
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getUserById(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    stripUnknown: boolean
  ): Promise<null | {
    user: User;
    shardId: number;
    password: string;
    accessKey: string;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.USER)
              .where('userId', userId)
              .limit(1)
          );

          const first = _.first(result);
          if (typeof first === 'undefined') {
            resolve(null);
          } else {
            const userRow = this.userRowResolver.resolve(first, stripUnknown);

            const user = await this.getCompleteUserByRow(
              db,
              userRow,
              stripUnknown
            );

            resolve({
              user,
              shardId: userRow.shardId,
              password: userRow.password,
              accessKey: userRow.accessKey,
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getUserByEmail(
    db: knex | knex.Transaction | knex.QueryBuilder,
    email: string,
    stripUnknown: boolean
  ): Promise<null | {
    user: User;
    shardId: number;
    password: string;
    accessKey: string;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.USER)
              .where({ email })
              .limit(1)
          );
          const first = _.first(result);
          if (typeof first === 'undefined') {
            resolve(null);
          } else {
            const userRow = this.userRowResolver.resolve(first, stripUnknown);
            const user = await this.getCompleteUserByRow(
              db,
              userRow,
              stripUnknown
            );

            resolve({
              user,
              shardId: userRow.shardId,
              password: userRow.password,
              accessKey: userRow.accessKey,
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getUserIdByEmail(
    db: knex | knex.Transaction,
    email: string
  ): Promise<null | string> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select('userId')
              .from(TableName.USER)
              .where({ email })
              .limit(1)
          );
          const first = _.first(result);
          if (typeof first === 'undefined') {
            resolve(null);
          } else {
            const partialUser = this.userRowResolver.resolvePartial(
              first,
              true
            );
            const userId = assertExists(
              partialUser.userId,
              'userId should not be null or undefined'
            );
            resolve(userId);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public emailExists(
    db: knex | knex.Transaction,
    email: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.USER)
              .where({ email })
              .limit(1)
          );
          if (typeof _.first(result) === 'undefined') {
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getLatestUpdateTime(
    db: knex | knex.Transaction,
    userId: string
  ): Promise<Date | null> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select(['updatedAt'])
              .from(TableName.USER)
              .where('userId', userId)
          );

          if (result.length === 1) {
            const { updatedAt } = result[0];
            resolve(updatedAt);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getLatestSyncTime(
    db: knex | knex.Transaction,
    userId: string
  ): Promise<Date | null> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select(['lastSyncedAt'])
              .from(TableName.USER)
              .where('userId', userId)
          );

          if (result.length === 1) {
            const { lastSyncedAt } = result[0];
            resolve(lastSyncedAt);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertUser(
    db: knex.Transaction,
    user: User,
    shardId: number,
    password: string,
    accessKey: string
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          const userRow = this.userRowPreparer.prepareInsert(
            user,
            shardId,
            password,
            accessKey
          );

          queries.push(promisifyQuery(db.insert(userRow).into(TableName.USER)));

          queries.push(
            this.userExtraDataModel.upsertMultipleExtraData(
              db,
              user.userId,
              user.extraData
            )
          );

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public updateUser(
    db: knex.Transaction,
    user: DeepPartial<User>,
    password: undefined | string,
    accessKey: undefined | string
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries = [];

          const userRow = this.userRowPreparer.prepareUpdate(
            user,
            password,
            accessKey
          );

          const userId = assertExists(userRow.userId);
          const updateFields = _.omit(userRow, 'userId');

          if (!_.isEmpty(updateFields)) {
            queries.push(
              promisifyQuery(
                db
                  .update(updateFields)
                  .where({
                    userId,
                  })
                  .table(TableName.USER)
              )
            );
          }

          if (typeof user.extraData !== 'undefined') {
            queries.push(
              this.userExtraDataModel.upsertMultipleExtraData(
                db,
                userId,
                user.extraData
              )
            );
          }

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private getCompleteUserByRow(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userRow: UserRow,
    stripUnknown: boolean
  ): Promise<User> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const {
            userExtraData,
          } = await this.userExtraDataModel.getExtraDataByUserId(
            db,
            userRow.userId,
            stripUnknown
          );

          const user = this.userRowConverter.convertToUser(
            userRow,
            userExtraData
          );

          resolve(user);
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
