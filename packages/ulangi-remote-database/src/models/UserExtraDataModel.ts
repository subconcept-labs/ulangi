/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as knex from 'knex';
import * as _ from 'lodash';

import { UserExtraDataRowConverter } from '../converters/UserExtraDataRowConverter';
import { TableName } from '../enums/TableName';
import { UserExtraDataRowForUpsert } from '../interfaces/UserExtraDataRow';
import { UserExtraDataRowPreparer } from '../preparers/UserExtraDataRowPreparer';
import { UserExtraDataRowResolver } from '../resolvers/UserExtraDataRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class UserExtraDataModel {
  private userExtraDataRowResolver = new UserExtraDataRowResolver();
  private userExtraDataRowPreparer = new UserExtraDataRowPreparer();
  private userExtraDataRowConverter = new UserExtraDataRowConverter();

  public getExtraDataByUserId(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    stripUnknown: boolean
  ): Promise<{
    userExtraData: readonly UserExtraDataItem[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.USER_EXTRA_DATA)
              .where('userId', userId)
          );

          const userExtraDataRows = this.userExtraDataRowResolver.resolveArray(
            result,
            stripUnknown
          );

          const userExtraData = this.userExtraDataRowConverter.convertToUserExtraDataItems(
            userExtraDataRows,
            stripUnknown
          );

          resolve({ userExtraData });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertMultipleExtraData(
    db: knex.Transaction,
    userId: string,
    userExtraData: readonly DeepPartial<UserExtraDataItem>[]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          if (userExtraData.length > 0) {
            const userExtraDataRows = userExtraData.map(
              (extraDataItem): UserExtraDataRowForUpsert => {
                return this.userExtraDataRowPreparer.prepareUpsert(
                  userId,
                  extraDataItem
                );
              }
            );

            const { sql, bindings } = db
              .insert(userExtraDataRows)
              .into(TableName.USER_EXTRA_DATA)
              .toSQL();

            queries.push(
              promisifyQuery(
                db.raw(sql.replace('insert', 'insert ignore'), bindings)
              )
            );

            queries.push(
              ...userExtraDataRows.map(
                (row): Promise<void> => {
                  const { userId, dataName } = row;
                  const updateFields = _.omit(row, ['userId', 'dataName']);
                  return promisifyQuery(
                    db
                      .update(updateFields)
                      .table(TableName.USER_EXTRA_DATA)
                      .where({
                        userId,
                        dataName,
                      })
                  );
                }
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
}
