/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists, assertTrue } from '@ulangi/assert';
import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UploadUserRequest } from '@ulangi/ulangi-common/interfaces';
import { UploadUserResponseResolver } from '@ulangi/ulangi-common/resolvers';
import { DirtyUserModel, SessionModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';

export class UploadUserSaga {
  private uploadUserResponseResolver = new UploadUserResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private dirtyUserModel: DirtyUserModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    dirtyUserModel: DirtyUserModel,
    crashlytics: CrashlyticsAdapter
  ) {
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.dirtyUserModel = dirtyUserModel;
    this.crashlytics = crashlytics;
  }

  public *uploadUser(apiUrl: string): IterableIterator<any> {
    let success, noMore;
    try {
      const userId: PromiseType<
        ReturnType<SessionModel['getUserId']>
      > = yield call([this.sessionModel, 'getUserId'], this.sharedDb);

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      const result: PromiseType<
        ReturnType<DirtyUserModel['getDirtyUserForSyncing']>
      > = yield call(
        [this.dirtyUserModel, 'getDirtyUserForSyncing'],
        this.userDb,
        assertExists(userId),
        true
      );

      const { user, markUserAsSynced } = result;

      yield put(
        createAction(ActionType.USER__UPLOADING_USER, {
          user,
        })
      );

      noMore = user === null;

      if (user !== null) {
        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<UploadUserRequest>(
            'post',
            apiUrl,
            '/upload-user',
            null,
            { user },
            { accessToken: assertExists(accessToken) }
          )
        );

        const uploadResult = this.uploadUserResponseResolver.resolve(
          response.data,
          true
        );
        success = assertTrue(uploadResult.success);

        yield call([this.userDb, 'transaction'], markUserAsSynced);

        yield put(
          createAction(ActionType.USER__UPLOAD_USER_SUCCEEDED, {
            noMore,
          })
        );
      } else {
        success = true;
        yield put(
          createAction(ActionType.USER__UPLOAD_USER_SUCCEEDED, { noMore })
        );
      }
    } catch (error) {
      yield put(
        createAction(ActionType.USER__UPLOAD_USER_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );

      success = false;
    }

    return { success, noMore };
  }
}
