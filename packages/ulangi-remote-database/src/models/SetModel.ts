/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as knex from 'knex';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SetRowConverter } from '../converters/SetRowConverter';
import { TableName } from '../enums/TableName';
import { SetRow, SetRowForInsert } from '../interfaces/SetRow';
import { SetExtraDataModel } from '../models/SetExtraDataModel';
import { SetRowPreparer } from '../preparers/SetRowPreparer';
import { SetRowResolver } from '../resolvers/SetRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class SetModel {
  private setRowResolver = new SetRowResolver();
  private setRowPreparer = new SetRowPreparer();
  private setRowConverter = new SetRowConverter();

  private setExtraDataModel: SetExtraDataModel;

  public constructor(setExtraDataModel: SetExtraDataModel) {
    this.setExtraDataModel = setExtraDataModel;
  }

  public getSetsByLastSyncTime(
    db: knex | knex.Transaction,
    userId: string,
    softLimit: number,
    startAt: undefined | Date,
    stripUnknown: boolean
  ): Promise<{
    setList: readonly Set[];
    noMore: boolean;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          // Fetch vocabulary at startAt time
          const firstQuery = promisifyQuery(
            db
              .select()
              .from(TableName.SET)
              .where('userId', userId)
              .where(
                'lastSyncedAt',
                '=',
                typeof startAt === 'undefined'
                  ? moment.unix(0).toDate()
                  : startAt
              )
              .orderBy('lastSyncedAt', 'asc')
          );

          // Fetch vocabulary with start from startAt time
          const secondQuery = promisifyQuery(
            db
              .select()
              .from(TableName.SET)
              .where('userId', userId)
              .where(
                'lastSyncedAt',
                '>',
                typeof startAt === 'undefined'
                  ? moment.unix(0).toDate()
                  : startAt
              )
              .orderBy('lastSyncedAt', 'asc')
              .limit(softLimit)
          );

          const [firstResultSet, secondResultSet] = await Promise.all([
            firstQuery,
            secondQuery,
          ]);

          const noMore = secondResultSet.length === 0;

          const result = _.union(firstResultSet, secondResultSet);

          const setRows = this.setRowResolver.resolveArray(
            result,
            stripUnknown
          );

          const { setList } = await this.getCompleteSetsByRows(
            db,
            userId,
            setRows,
            stripUnknown
          );

          resolve({ setList, noMore });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getSetsByIds(
    db: knex | knex.Transaction,
    userId: string,
    setIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    setList: readonly Set[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.SET)
              .where('userId', userId)
              .whereIn('setId', setIds.slice())
          );

          const setRows = this.setRowResolver.resolveArray(
            result,
            stripUnknown
          );

          const { setList } = await this.getCompleteSetsByRows(
            db,
            userId,
            setRows,
            stripUnknown
          );

          resolve({ setList });
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
              .max('lastSyncedAt AS latestSyncTime')
              .from(TableName.SET)
              .where('userId', userId)
          );

          if (result.length === 1) {
            const { latestSyncTime } = result[0];
            resolve(latestSyncTime);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getExistingSetIds(
    db: knex | knex.Transaction,
    userId: string,
    setIds: readonly string[]
  ): Promise<{
    existingSetIds: readonly string[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select('setId')
              .from(TableName.SET)
              .where('userId', userId)
              .whereIn('setId', setIds.slice())
          );

          resolve({
            existingSetIds: result.map(
              (row: { setId: string }): string => row.setId
            ),
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }
  public upsertSets(
    db: knex.Transaction,
    userId: string,
    sets: readonly DeepPartial<Set>[]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: (Promise<void | void[]>)[] = [];

          queries.push(
            this.insertOrIgnoreSets(
              db,
              userId,
              sets.filter(
                (set): set is Set => {
                  return this.setRowPreparer.canPrepareInsert(userId, set);
                }
              )
            )
          );

          queries.push(this.updateSets(db, userId, sets));

          queries.push(
            this.setExtraDataModel.upsertMultipleExtraData(
              db,
              userId,
              _.flatMap(
                sets,
                (set): [DeepPartial<SetExtraDataItem>, string][] => {
                  return typeof set.extraData !== 'undefined'
                    ? set.extraData.map(
                        (
                          extraDataItem
                        ): [DeepPartial<SetExtraDataItem>, string] => [
                          extraDataItem,
                          assertExists(set.setId),
                        ]
                      )
                    : [];
                }
              )
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

  private insertOrIgnoreSets(
    db: knex.Transaction,
    userId: string,
    sets: readonly Set[]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];
          if (sets.length > 0) {
            const setRows = sets.map(
              (set): SetRowForInsert => {
                return this.setRowPreparer.prepareInsert(userId, set);
              }
            );

            const { sql, bindings } = db(TableName.SET)
              .insert(setRows)
              .toSQL();

            queries.push(
              promisifyQuery(
                db.raw(sql.replace('insert', 'insert ignore'), bindings)
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

  private updateSets(
    db: knex.Transaction,
    userId: string,
    sets: readonly DeepPartial<Set>[]
  ): Promise<void[]> {
    return Promise.all(
      sets.map(
        (set): Promise<void> => {
          return this.updateSet(db, userId, set);
        }
      )
    );
  }

  private updateSet(
    db: knex.Transaction,
    userId: string,
    set: DeepPartial<Set>
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          const setRow = this.setRowPreparer.prepareUpdate(userId, set);

          const setId = setRow.setId;
          const updateFields = _.omit(setRow, ['userId', 'setId']);
          if (!_.isEmpty(updateFields)) {
            queries.push(
              promisifyQuery(
                db
                  .update(updateFields)
                  .table(TableName.SET)
                  .where({
                    userId,
                    setId,
                  })
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

  private getCompleteSetsByRows(
    db: knex | knex.Transaction,
    userId: string,
    setRows: readonly SetRow[],
    stripUnknown: boolean
  ): Promise<{
    setList: readonly Set[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const setIds = setRows.map((setRow): string => setRow.setId);

          const {
            setExtraDataPerSetId,
          } = await this.setExtraDataModel.getExtraDataBySetIds(
            db,
            userId,
            setIds,
            stripUnknown
          );

          const setList = setRows.map(
            (setRow): Set => {
              const extraData = setExtraDataPerSetId[setRow.setId] || [];
              return this.setRowConverter.convertToSet(setRow, extraData);
            }
          );

          resolve({ setList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
