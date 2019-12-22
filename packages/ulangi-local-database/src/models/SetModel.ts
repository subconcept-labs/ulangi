/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as squel from 'squel';

import { SetRowConverter } from '../converters/SetRowConverter';
import { DatabaseEvent } from '../enums/DatabaseEvent';
import { TableName } from '../enums/TableName';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { SetRow } from '../interfaces/SetRow';
import { SetExtraDataModel } from '../models/SetExtraDataModel';
import { SetRowPreparer } from '../preparers/SetRowPreparer';
import { SetRowResolver } from '../resolvers/SetRowResolver';
import { DirtySetModel } from './DirtySetModel';

export class SetModel {
  private setRowResolver = new SetRowResolver();
  private setRowPreparer = new SetRowPreparer();
  private setRowConverter = new SetRowConverter();

  private setExtraDataModel: SetExtraDataModel;
  private dirtySetModel: DirtySetModel;
  private databaseEventBus: DatabaseEventBus;

  public constructor(
    setExtraDataModel: SetExtraDataModel,
    dirtySetModel: DirtySetModel,
    databaseEventBus: DatabaseEventBus
  ) {
    this.setExtraDataModel = setExtraDataModel;
    this.dirtySetModel = dirtySetModel;
    this.databaseEventBus = databaseEventBus;
  }

  public getSetById(
    db: SQLiteDatabase,
    setId: string,
    stripUnknown: boolean
  ): Promise<null | { set: Set }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.SET)
            .where('setId = ?', setId)
            .toParam();
          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length === 1) {
            const item = result.rows[0];

            const setRow = this.setRowResolver.resolve(item, stripUnknown);

            const set = await this.getCompleteSetByRow(
              db,
              setRow,
              stripUnknown
            );

            resolve({ set });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getAllSets(
    db: SQLiteDatabase,
    stripUnknown: boolean
  ): Promise<{
    setList: readonly Set[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.SET)
            .order('setName')
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          const setRows = this.setRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const setList = await this.getCompleteSetListByRows(
            db,
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

  public getSetsByStatus(
    db: SQLiteDatabase,
    setStatus: SetStatus,
    stripUnknown: boolean
  ): Promise<{
    setList: readonly Set[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.SET)
            .where('setStatus = ?', setStatus)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          const setRows = this.setRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const setList = await this.getCompleteSetListByRows(
            db,
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

  public getLatestSyncTime(db: SQLiteDatabase): Promise<null | Date> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .field('MAX(lastSyncedAt) AS latestSyncTime')
            .from(TableName.SET)
            .toParam();
          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length === 1) {
            const { latestSyncTime } = result.rows[0];
            resolve(
              latestSyncTime ? moment.unix(latestSyncTime).toDate() : null
            );
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public setIdsExist(db: SQLiteDatabase, setIds: string[]): Promise<string[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.SET)
            .field('setId')
            .where('setId IN ?', setIds)
            .toParam();
          const result = await db.executeSql(query.text, query.values);
          const existedSetIds = [];
          for (let i = 0; i < result.rows.length; ++i) {
            const { setId } = result.rows[i];
            existedSetIds.push(setId);
          }

          resolve(existedSetIds);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertSet(
    tx: Transaction,
    set: Set,
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    const setRow = this.setRowPreparer.prepareInsert(set, source);

    const query = squel
      .insert()
      .into(TableName.SET)
      .setFields(setRow)
      .toParam();

    tx.executeSql(query.text, query.values);
    // Mark as dirty
    if (source === 'local') {
      this.dirtySetModel.insertOrReplaceDirtyFields(
        tx,
        setRow.setId,
        _.keys(_.omit(setRow, 'setId'))
      );
    }

    if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
      tx.onCommitted(
        (): void => {
          this.databaseEventBus.publish(DatabaseEvent.SET_INSERTED_FROM_LOCAL);
        }
      );
    }

    this.setExtraDataModel.upsertMultipleExtraData(
      tx,
      set.extraData.map(
        (extraDataItem): [SetExtraDataItem, string] => [
          extraDataItem,
          set.setId,
        ]
      ),
      source
    );
  }

  public insertSets(
    tx: Transaction,
    sets: readonly Set[],
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    sets.forEach(
      (set): void => {
        this.insertSet(
          tx,
          set,
          source,
          _.merge(options, { doNotPublishEvent: true })
        );
      }
    );

    if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
      tx.onCommitted(
        (): void => {
          this.databaseEventBus.publish(DatabaseEvent.SET_INSERTED_FROM_LOCAL);
        }
      );
    }
  }

  public updateSet(
    tx: Transaction,
    set: DeepPartial<Set>,
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    const setId = assertExists(set.setId);
    const setRow = this.setRowPreparer.prepareUpdate(set, source);

    const updateFields =
      source === 'local'
        ? _.omit(setRow, [
            'setId',
            'createdAt',
            'firstSyncedAt',
            'lastSyncedAt',
          ])
        : _.omit(setRow, ['setId', 'createdAt']);

    if (!_.isEmpty(updateFields)) {
      if (source === 'remote') {
        // Only update the value if it's not dirty
        const queries = _.map(
          updateFields,
          (fieldValue, fieldName): squel.ParamString => {
            return squel
              .update()
              .set(fieldName, fieldValue)
              .table(TableName.SET)
              .where('setId = ?', setId)
              .where(
                'NOT EXISTS ?',
                squel
                  .select()
                  .from(TableName.DIRTY_SET_FIELD)
                  .where('setId = ?', setId)
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
        // Update the value and mark as dirty
        const query = squel
          .update()
          .table(TableName.SET)
          .setFields(updateFields)
          .where('setId = ?', setId)
          .toParam();

        tx.executeSql(query.text, query.values);
        this.dirtySetModel.insertOrReplaceDirtyFields(
          tx,
          setId,
          _.keys(_.omit(setRow, 'setId'))
        );
      }

      if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
        tx.onCommitted(
          (): void => {
            this.databaseEventBus.publish(DatabaseEvent.SET_UPDATED_FROM_LOCAL);
          }
        );
      }
    }

    if (typeof set.extraData !== 'undefined') {
      this.setExtraDataModel.upsertMultipleExtraData(
        tx,
        set.extraData.map(
          (extraDataItem): [DeepPartial<SetExtraDataItem>, string] => [
            extraDataItem,
            assertExists(set.setId),
          ]
        ),
        source
      );
    }
  }

  public updateSets(
    tx: Transaction,
    sets: readonly DeepPartial<Set>[],
    source: 'local' | 'remote',
    options?: { doNotPublishEvent?: boolean }
  ): void {
    sets.forEach(
      (set): void => {
        this.updateSet(
          tx,
          set,
          source,
          _.merge(options, { doNotPublishEvent: true })
        );
      }
    );

    if (_.get(options, 'doNotPublishEvent') !== true && source === 'local') {
      tx.onCommitted(
        (): void => {
          this.databaseEventBus.publish(DatabaseEvent.SET_UPDATED_FROM_LOCAL);
        }
      );
    }
  }

  private async getCompleteSetByRow(
    db: SQLiteDatabase,
    setRow: SetRow,
    stripUnknown: boolean
  ): Promise<Set> {
    const setList = await this.getCompleteSetListByRows(
      db,
      [setRow],
      stripUnknown
    );
    return assertExists(_.first(setList));
  }

  private async getCompleteSetListByRows(
    db: SQLiteDatabase,
    setRows: readonly SetRow[],
    stripUnknown: boolean
  ): Promise<readonly Set[]> {
    const setIds = setRows.map((setRow): string => setRow.setId);

    const {
      setExtraDataPerSetId,
    } = await this.setExtraDataModel.getExtraDataBySetIds(
      db,
      setIds,
      stripUnknown
    );

    const setList = setRows.map(
      (setRow): Set => {
        const extraData = setExtraDataPerSetId[setRow.setId] || [];
        return this.setRowConverter.convertToSet(setRow, extraData);
      }
    );

    return setList;
  }
}
