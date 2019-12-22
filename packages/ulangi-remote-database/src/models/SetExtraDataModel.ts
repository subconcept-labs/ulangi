/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as knex from 'knex';
import * as _ from 'lodash';

import { SetExtraDataRowConverter } from '../converters/SetExtraDataRowConverter';
import { TableName } from '../enums/TableName';
import { SetExtraDataRowForUpsert } from '../interfaces/SetExtraDataRow';
import { SetExtraDataRowPreparer } from '../preparers/SetExtraDataRowPreparer';
import { SetExtraDataRowResolver } from '../resolvers/SetExtraDataRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class SetExtraDataModel {
  private setExtraDataRowResolver = new SetExtraDataRowResolver();
  private setExtraDataRowPreparer = new SetExtraDataRowPreparer();
  private setExtraDataRowConverter = new SetExtraDataRowConverter();

  public getExtraDataBySetIds(
    db: knex | knex.Transaction,
    userId: string,
    setIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    setExtraDataPerSetId: { [P in string]: readonly SetExtraDataItem[] };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.SET_EXTRA_DATA)
              .where('userId', userId)
              .whereIn('setId', setIds.slice())
          );

          const setExtraDataRows = this.setExtraDataRowResolver.resolveArray(
            result,
            stripUnknown
          );

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

  public upsertMultipleExtraData(
    db: knex.Transaction,
    userId: string,
    setExtraDataItemSetIdPairs: readonly [
      DeepPartial<SetExtraDataItem>,
      string
    ][]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          const setExtraDataRows = setExtraDataItemSetIdPairs.map(
            ([setExtraDataItem, setId]): SetExtraDataRowForUpsert => {
              return this.setExtraDataRowPreparer.prepareUpsert(
                userId,
                setExtraDataItem,
                setId
              );
            }
          );

          const { sql, bindings } = db
            .insert(setExtraDataRows)
            .into(TableName.SET_EXTRA_DATA)
            .toSQL();

          queries.push(
            promisifyQuery(
              db.raw(sql.replace('insert', 'insert ignore'), bindings)
            )
          );

          queries.push(
            ...setExtraDataRows.map(
              (row): Promise<void> => {
                const { userId, setId, dataName } = row;
                const updateFields = _.omit(row, [
                  'userId',
                  'setId',
                  'dataName',
                ]);
                return promisifyQuery(
                  db
                    .update(updateFields)
                    .table(TableName.SET_EXTRA_DATA)
                    .where({
                      userId,
                      setId,
                      dataName,
                    })
                );
              }
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
}
