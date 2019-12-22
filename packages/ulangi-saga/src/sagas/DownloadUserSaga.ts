/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { DownloadUserRequest } from '@ulangi/ulangi-common/interfaces';
import { DownloadUserResponseResolver } from '@ulangi/ulangi-common/resolvers';
import { SessionModel, UserModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';

export class DownloadUserSaga {
  private downloadUserResponseResolver = new DownloadUserResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private userModel: UserModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    userModel: UserModel,
    crashlytics: CrashlyticsAdapter
  ) {
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.userModel = userModel;
    this.crashlytics = crashlytics;
  }

  public *downloadUser(apiUrl: string): IterableIterator<any> {
    let success;
    try {
      yield put(createAction(ActionType.USER__DOWNLOADING_USER, null));

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      const response: AxiosResponse<any> = yield call(
        [axios, 'request'],
        createRequest<DownloadUserRequest>(
          'get',
          apiUrl,
          '/download-user',
          null,
          null,
          { accessToken: assertExists(accessToken) }
        )
      );

      const { user } = this.downloadUserResponseResolver.resolve(
        response.data,
        true
      );

      yield call(
        [this.userDb, 'transaction'],
        (tx: Transaction): void => {
          this.userModel.updateUser(tx, user, 'remote');
        }
      );

      yield put(createAction(ActionType.USER__DOWNLOAD_USER_SUCCEEDED, null));
      success = true;
    } catch (error) {
      yield put(
        createAction(ActionType.USER__DOWNLOAD_USER_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
      success = false;
    }

    return { success, noMore: true };
  }
}
