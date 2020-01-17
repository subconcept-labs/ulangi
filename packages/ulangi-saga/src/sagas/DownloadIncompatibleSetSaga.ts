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
import { DownloadSpecificSetsRequest } from '@ulangi/ulangi-common/interfaces';
import {
  DownloadSpecificSetsResponseResolver,
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

export class DownloadIncompatibleSetSaga {
  private setResolver = new SetResolver();
  private downloadSpecificSetsResponseResolver = new DownloadSpecificSetsResponseResolver();

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

  public *downloadIncompatibleSets(
    apiUrl: string,
    downloadLimit: number,
    transactionChunkSize: number,
    delayBetweenChunks: number
  ): IterableIterator<any> {
    let success, noMore;
    try {
      yield put(
        createAction(ActionType.SET__DOWNLOADING_INCOMPATIBLE_SETS, null)
      );

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      const latestSyncedTime: PromiseType<
        ReturnType<SetModel['getLatestSyncTime']>
      > = yield call([this.setModel, 'getLatestSyncTime'], this.userDb);

      const {
        setIds: existingIncompatibleSetIds,
      }: PromiseType<
        ReturnType<IncompatibleSetModel['getIncompatibleSetIdsForRedownload']>
      > = yield call(
        [this.incompatibleSetModel, 'getIncompatibleSetIdsForRedownload'],
        this.userDb,
        currentComparableCommonVersion,
        downloadLimit,
        true
      );

      noMore = existingIncompatibleSetIds.length === 0;
      if (noMore === false) {
        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<DownloadSpecificSetsRequest>(
            'post',
            apiUrl,
            '/download-specific-sets',
            null,
            {
              setIds: existingIncompatibleSetIds,
            },
            { accessToken: assertExists(accessToken) }
          )
        );

        const {
          setList: downloadedSetList,
        } = this.downloadSpecificSetsResponseResolver.resolve(
          response.data,
          true
        );

        const setList = downloadedSetList.filter(
          (set): boolean => {
            return (
              set.lastSyncedAt !== null &&
              latestSyncedTime !== null &&
              set.lastSyncedAt <= latestSyncedTime
            );
          }
        );

        const existedSetIds: PromiseType<
          ReturnType<SetModel['setIdsExist']>
        > = yield call(
          [this.setModel, 'setIdsExist'],
          this.userDb,
          setList.map((set): string => set.setId)
        );

        const chunks = _.chunk(setList, transactionChunkSize);

        for (const chunk of chunks) {
          const stillIncompatibleSetIds: readonly string[] = response.data.setList
            .filter(
              (set: any): set is { setId: string } => {
                return _.has(set, 'setId') && _.isString(set.setId);
              }
            )
            .filter(
              (set: { setId: string }): boolean => {
                return _.includes(
                  chunk.map((set): string => set.setId),
                  set.setId
                );
              }
            )
            .filter(
              (set: { setId: string }): boolean => {
                return !this.setResolver.isValid(set, false);
              }
            )
            .map(
              (set: { setId: string }): string => {
                return set.setId;
              }
            );

          yield call(
            [this.userDb, 'transaction'],
            (tx: Transaction): void => {
              this.setModel.insertSets(
                tx,
                chunk.filter(
                  (set): boolean => !_.includes(existedSetIds, set.setId)
                ),
                'remote'
              );
              this.setModel.updateSets(
                tx,
                chunk.filter(
                  (set): boolean => _.includes(existedSetIds, set.setId)
                ),
                'remote'
              );
              this.incompatibleSetModel.deleteIncompatibleSets(
                tx,
                chunk.map((set): string => set.setId)
              );
              this.incompatibleSetModel.upsertIncompatibleSets(
                tx,
                stillIncompatibleSetIds,
                currentComparableCommonVersion
              );
            }
          );

          yield delay(delayBetweenChunks);
        }

        yield put(
          createAction(ActionType.SET__DOWNLOAD_INCOMPATIBLE_SETS_SUCCEEDED, {
            setList,
          })
        );
      } else {
        yield put(
          createAction(ActionType.SET__DOWNLOAD_INCOMPATIBLE_SETS_SUCCEEDED, {
            setList: [],
          })
        );
      }

      success = true;
    } catch (error) {
      yield put(
        createAction(ActionType.SET__DOWNLOAD_INCOMPATIBLE_SETS_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
      success = false;
    }

    return { success, noMore };
  }
}
