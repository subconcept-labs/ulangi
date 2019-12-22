/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { GetDictionaryEntryRequest } from '@ulangi/ulangi-common/interfaces';
import { GetDictionaryEntryResponseResolver } from '@ulangi/ulangi-common/resolvers';
import { SessionModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class DictionarySaga extends ProtectedSaga {
  private getEntryTask?: Task;

  private getDictionaryEntryResponseResolver = new GetDictionaryEntryResponseResolver();

  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    sharedDb: SQLiteDatabase,
    sessionModel: SessionModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
    this.crashlytics = crashlytics;
  }

  public *run(config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.allowGetAndClearEntry], config.env.apiUrl);
  }

  public *allowGetAndClearEntry(apiUrl: string): IterableIterator<any> {
    this.getEntryTask = yield fork([this, this.allowGetEntry], apiUrl);
    yield fork([this, this.allowClearEntry], apiUrl);
  }

  private *allowClearEntry(apiUrl: string): IterableIterator<any> {
    while (true) {
      yield take(ActionType.DICTIONARY__CLEAR_ENTRY);
      if (typeof this.getEntryTask !== 'undefined') {
        yield cancel(this.getEntryTask);
      }

      this.getEntryTask = yield fork([this, this.allowGetEntry], apiUrl);
    }
  }

  private *allowGetEntry(apiUrl: string): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.DICTIONARY__GET_ENTRY> = yield take(
        ActionType.DICTIONARY__GET_ENTRY
      );
      const {
        searchTerm,
        searchTermLanguageCode,
        translatedToLanguageCode,
      } = action.payload;

      try {
        yield put(createAction(ActionType.DICTIONARY__GETTING_ENTRY, null));

        const result: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const accessToken = assertExists(result);

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<GetDictionaryEntryRequest>(
            'get',
            apiUrl,
            '/get-dictionary-entry',
            {
              searchTerm,
              searchTermLanguageCode,
              translatedToLanguageCode,
            },
            null,
            { accessToken }
          )
        );

        const {
          dictionaryEntry,
        } = this.getDictionaryEntryResponseResolver.resolve(
          response.data,
          true
        );
        yield put(
          createAction(ActionType.DICTIONARY__GET_ENTRY_SUCCEEDED, {
            dictionaryEntry,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.DICTIONARY__GET_ENTRY_FAILED, {
            searchTerm,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
}
