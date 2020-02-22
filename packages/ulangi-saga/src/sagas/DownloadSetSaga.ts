/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { currentComparableCommonVersion } from '@ulangi/ulangi-common';
import { DownloadSetsRequest } from '@ulangi/ulangi-common/interfaces';
import {
  DownloadSetsResponseResolver,
  SetResolver,
} from '@ulangi/ulangi-common/resolvers';
import {
  IncompatibleSetModel,
  SessionModel,
  SetModel,
} from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import { call, delay, put } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { createRequest } from '../utils/createRequest';

export class DownloadSetSaga {
  private setResolver = new SetResolver();
  private downloadSetsResponseResolver = new DownloadSetsResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private setModel: SetModel;
  private incompatibleSetModel: IncompatibleSetModel;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    setModel: SetModel,
    incompatibleSetModel: IncompatibleSetModel
  ) {
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.setModel = setModel;
    this.incompatibleSetModel = incompatibleSetModel;
  }

  public *downloadSets(
    apiUrl: string,
    downloadLimit: number,
    delayBetweenTransactions: number
  ): IterableIterator<any> {
    let success, noMore;
    try {
      const latestSyncedTime: PromiseType<
        ReturnType<SetModel['getLatestSyncTime']>
      > = yield call([this.setModel, 'getLatestSyncTime'], this.userDb);

      yield put(
        createAction(ActionType.SET__DOWNLOADING_SETS, {
          startAt: latestSyncedTime,
        })
      );

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      const response: AxiosResponse<any> = yield call(
        [axios, 'request'],
        createRequest<DownloadSetsRequest>(
          'get',
          apiUrl,
          '/download-sets',
          {
            startAt: latestSyncedTime === null ? undefined : latestSyncedTime,
            softLimit: downloadLimit,
          },
          null,
          { accessToken: assertExists(accessToken) }
        )
      );

      const {
        setList: downloadedSetList,
        noMore: noMoreSets,
      } = this.downloadSetsResponseResolver.resolve(response.data, true);
      noMore = noMoreSets;

      const setList = _.sortBy(downloadedSetList, 'lastSyncedAt');

      const existingSetIds: PromiseType<
        ReturnType<SetModel['setIdsExist']>
      > = yield call(
        [this.setModel, 'setIdsExist'],
        this.userDb,
        setList.map((set): string => set.setId)
      );

      for (const set of setList) {
        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            !_.includes(existingSetIds, set.setId)
              ? this.setModel.insertSet(tx, set, 'remote')
              : this.setModel.updateSet(tx, set, 'remote'),
              !this.setResolver.isValid(set, false)
                ? this.incompatibleSetModel.upsertIncompatibleSet(
                    tx,
                    set.setId,
                    currentComparableCommonVersion
                  )
                : _.noop();
          }
        );

        yield delay(delayBetweenTransactions);
      }

      yield put(
        createAction(ActionType.SET__DOWNLOAD_SETS_SUCCEEDED, {
          setList,
          noMore,
        })
      );
      success = true;
    } catch (error) {
      yield put(
        createAction(ActionType.SET__DOWNLOAD_SETS_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
      success = false;
    }

    return { success, noMore };
  }
}
