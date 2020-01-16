/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UploadSetsRequest } from '@ulangi/ulangi-common/interfaces';
import { UploadSetsResponseResolver } from '@ulangi/ulangi-common/resolvers';
import { DirtySetModel, SessionModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { createRequest } from '../utils/createRequest';

export class UploadSetSaga {
  private uploadSetsResponseResolver = new UploadSetsResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private dirtySetModel: DirtySetModel;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    dirtySetModel: DirtySetModel
  ) {
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.dirtySetModel = dirtySetModel;
  }

  public *uploadSets(
    apiUrl: string,
    uploadLimit: number
  ): IterableIterator<any> {
    let success, noMore;
    try {
      const result: PromiseType<
        ReturnType<DirtySetModel['getDirtySetsForSyncing']>
      > = yield call(
        [this.dirtySetModel, 'getDirtySetsForSyncing'],
        this.userDb,
        uploadLimit,
        true
      );

      const { setList, markSetsAsSynced } = result;

      yield put(createAction(ActionType.SET__UPLOADING_SETS, { setList }));

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      noMore = setList.length === 0 ? true : false;

      if (noMore === false) {
        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<UploadSetsRequest>(
            'post',
            apiUrl,
            '/upload-sets',
            null,
            {
              setList,
            },
            { accessToken: assertExists(accessToken) }
          )
        );

        const {
          acknowledged: syncedSetIds,
        } = this.uploadSetsResponseResolver.resolve(response.data, true);

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            markSetsAsSynced(tx, syncedSetIds);
          }
        );

        yield put(
          createAction(ActionType.SET__UPLOAD_SETS_SUCCEEDED, { noMore })
        );
      } else {
        yield put(
          createAction(ActionType.SET__UPLOAD_SETS_SUCCEEDED, { noMore })
        );
      }

      success = true;
    } catch (error) {
      yield put(
        createAction(ActionType.SET__UPLOAD_SETS_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
      success = false;
    }

    return { success, noMore };
  }
}
