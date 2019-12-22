/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UploadVocabularyRequest } from '@ulangi/ulangi-common/interfaces';
import { UploadVocabularyResponseResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DirtyVocabularyModel,
  SessionModel,
} from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';

export class UploadVocabularySaga {
  private uploadVocabularyResponseResolver = new UploadVocabularyResponseResolver();

  private userDb: SQLiteDatabase;
  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private dirtyVocabularyModel: DirtyVocabularyModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    dirtyVocabularyModel: DirtyVocabularyModel,
    crashlytics: CrashlyticsAdapter
  ) {
    this.userDb = userDb;
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.dirtyVocabularyModel = dirtyVocabularyModel;
    this.crashlytics = crashlytics;
  }

  public *uploadVocabulary(
    apiUrl: string,
    uploadLimit: number
  ): IterableIterator<any> {
    let success, noMore;
    try {
      const result: PromiseType<
        ReturnType<DirtyVocabularyModel['getDirtyVocabularyListForSyncing']>
      > = yield call(
        [this.dirtyVocabularyModel, 'getDirtyVocabularyListForSyncing'],
        this.userDb,
        uploadLimit,
        true
      );

      const {
        vocabularyList,
        vocabularyIdSetIdPairs,
        markVocabularyListAsSynced,
      } = result;

      yield put(
        createAction(ActionType.VOCABULARY__UPLOADING_VOCABULARY, {
          vocabularyList,
        })
      );

      const accessToken: PromiseType<
        ReturnType<SessionModel['getAccessToken']>
      > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

      noMore = vocabularyList.length === 0 ? true : false;
      if (noMore === false) {
        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<UploadVocabularyRequest>(
            'post',
            apiUrl,
            '/upload-vocabulary',
            null,
            {
              vocabularyList,
              vocabularySetIdPairs: vocabularyIdSetIdPairs,
            },
            { accessToken: assertExists(accessToken) }
          )
        );

        const {
          acknowledged: syncedVocabularyIds,
        } = this.uploadVocabularyResponseResolver.resolve(response.data, true);

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            markVocabularyListAsSynced(tx, syncedVocabularyIds);
          }
        );

        yield put(
          createAction(ActionType.VOCABULARY__UPLOAD_VOCABULARY_SUCCEEDED, {
            noMore,
          })
        );
      } else {
        yield put(
          createAction(ActionType.VOCABULARY__UPLOAD_VOCABULARY_SUCCEEDED, {
            noMore,
          })
        );
      }
      success = true;
    } catch (error) {
      yield put(
        createAction(ActionType.VOCABULARY__UPLOAD_VOCABULARY_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
      success = false;
    }

    return { success, noMore };
  }
}
