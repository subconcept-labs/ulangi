/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  TranslateBidirectionRequest,
  TranslateRequest,
} from '@ulangi/ulangi-common/interfaces';
import {
  TranslateBidirectionResponseResolver,
  TranslateResponseResolver,
} from '@ulangi/ulangi-common/resolvers';
import { SessionModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaEnv } from '../interfaces/SagaEnv';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class TranslationSaga extends ProtectedSaga {
  private translateResponseResolver = new TranslateResponseResolver();
  private translateBidirectionResponseResolver = new TranslateBidirectionResponseResolver();

  private translateTask?: Task;
  private translateBidirectionTask?: Task;
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

  public *run(env: SagaEnv): IterableIterator<any> {
    yield fork([this, this.allowTranslateAndClearTranslations], env.API_URL);
    yield fork(
      [this, this.allowTranslateBidirectionAndClearBidirectionalTranslations],
      env.API_URL
    );
  }

  public *allowTranslateAndClearTranslations(
    apiUrl: string
  ): IterableIterator<any> {
    this.translateTask = yield fork([this, this.allowTranslate], apiUrl);
    yield fork([this, this.allowClearTranslations], apiUrl);
  }

  private *allowClearTranslations(apiUrl: string): IterableIterator<any> {
    while (true) {
      yield take(ActionType.TRANSLATION__CLEAR_TRANSLATIONS);
      if (typeof this.translateTask !== 'undefined') {
        yield cancel(this.translateTask);
      }

      this.translateTask = yield fork([this, this.allowTranslate], apiUrl);
    }
  }

  private *allowTranslate(apiUrl: string): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.TRANSLATION__TRANSLATE> = yield take(
        ActionType.TRANSLATION__TRANSLATE
      );
      const {
        sourceText,
        sourceLanguageCode,
        translatedToLanguageCode,
        translator,
      } = action.payload;

      try {
        yield put(createAction(ActionType.TRANSLATION__TRANSLATING, null));
        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<TranslateRequest>(
            'get',
            apiUrl,
            '/translate',
            {
              sourceText,
              sourceLanguageCode,
              translatedToLanguageCode,
              translator,
            },
            null,
            { accessToken: assertExists(accessToken) }
          )
        );

        const { translations } = this.translateResponseResolver.resolve(
          response.data,
          true
        );
        yield put(
          createAction(ActionType.TRANSLATION__TRANSLATE_SUCCEEDED, {
            translations,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.TRANSLATION__TRANSLATE_FAILED, {
            sourceText,
            translator,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowTranslateBidirectionAndClearBidirectionalTranslations(
    apiUrl: string
  ): IterableIterator<any> {
    this.translateBidirectionTask = yield fork(
      [this, this.allowTranslateBidirection],
      apiUrl
    );
    yield fork([this, this.allowClearBidiretionalTranslations], apiUrl);
  }

  private *allowClearBidiretionalTranslations(
    apiUrl: string
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.TRANSLATION__CLEAR_BIDIRECTIONAL_TRANSLATIONS);
      if (typeof this.translateBidirectionTask !== 'undefined') {
        yield cancel(this.translateBidirectionTask);
      }

      this.translateBidirectionTask = yield fork(
        [this, this.allowTranslateBidirection],
        apiUrl
      );
    }
  }

  private *allowTranslateBidirection(apiUrl: string): IterableIterator<any> {
    while (true) {
      const action: Action<
        ActionType.TRANSLATION__TRANSLATE_BIDIRECTION
      > = yield take(ActionType.TRANSLATION__TRANSLATE_BIDIRECTION);

      const { sourceText, languageCodePair } = action.payload;

      try {
        yield put(
          createAction(ActionType.TRANSLATION__TRANSLATING_BIDIRECTION, null)
        );
        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<TranslateBidirectionRequest>(
            'get',
            apiUrl,
            '/translate-bidirection',
            {
              sourceText,
              languageCodePair,
            },
            null,
            { accessToken: assertExists(accessToken) }
          )
        );

        const {
          translations,
        } = this.translateBidirectionResponseResolver.resolve(
          response.data,
          true
        );

        yield put(
          createAction(
            ActionType.TRANSLATION__TRANSLATE_BIDIRECTION_SUCCEEDED,
            {
              translations,
            }
          )
        );
      } catch (error) {
        yield put(
          createAction(ActionType.TRANSLATION__TRANSLATE_BIDIRECTION_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
}
