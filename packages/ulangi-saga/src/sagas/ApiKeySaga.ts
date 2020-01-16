/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists, assertTrue } from '@ulangi/assert';
import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { ApiScope } from '@ulangi/ulangi-common/enums';
import {
  DeleteApiKeyRequest,
  GetApiKeyRequest,
  SendApiKeyRequest,
} from '@ulangi/ulangi-common/interfaces';
import {
  DeleteApiKeyResponseResolver,
  GetApiKeyResponseResolver,
  SendApiKeyResponseResolver,
} from '@ulangi/ulangi-common/resolvers';
import { SessionModel } from '@ulangi/ulangi-local-database';
import axios from 'axios';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaEnv } from '../interfaces/SagaEnv';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class ApiKeySaga extends ProtectedSaga {
  private getApiKeyResponseResolver = new GetApiKeyResponseResolver();
  private deleteApiKeyResponseResolver = new DeleteApiKeyResponseResolver();
  private sendApiKeyResponseResolver = new SendApiKeyResponseResolver();

  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;

  public constructor(sharedDb: SQLiteDatabase, sessionModel: SessionModel) {
    super();
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
  }

  public *run(env: SagaEnv): IterableIterator<any> {
    yield fork([this, this.allowGetApiKey], env.API_URL);
    yield fork([this, this.allowDeleteApiKey], env.API_URL);
    yield fork([this, this.allowSendApiKey], env.API_URL);
  }

  public *allowGetApiKey(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        const action: Action<ActionType.API_KEY__GET_API_KEY> = yield take(
          ActionType.API_KEY__GET_API_KEY
        );

        yield put(createAction(ActionType.API_KEY__GETTING_API_KEY, null));

        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const { password } = action.payload;

        const response = yield call(
          [axios, 'request'],
          createRequest<GetApiKeyRequest>(
            'post',
            apiUrl,
            '/get-api-key',
            null,
            {
              password,
              apiScope: ApiScope.SYNC,
              createIfNotExists: true,
            },
            { accessToken: assertExists(accessToken) }
          )
        );

        const { apiKey, expiredAt } = this.getApiKeyResponseResolver.resolve(
          response.data,
          true
        );

        yield put(
          createAction(ActionType.API_KEY__GET_API_KEY_SUCCEEDED, {
            apiKey: assertExists(apiKey),
            expiredAt,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.API_KEY__GET_API_KEY_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowDeleteApiKey(apiUrl: string): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.API_KEY__DELETE_API_KEY> = yield take(
        ActionType.API_KEY__DELETE_API_KEY
      );

      yield put(createAction(ActionType.API_KEY__DELETING_API_KEY, null));

      try {
        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const { apiKey } = action.payload;

        const response = yield call(
          [axios, 'request'],
          createRequest<DeleteApiKeyRequest>(
            'post',
            apiUrl,
            '/delete-api-key',
            null,
            {
              apiKey,
            },
            {
              accessToken: assertExists(accessToken),
            }
          )
        );

        const { success } = this.deleteApiKeyResponseResolver.resolve(
          response.data,
          true
        );

        assertTrue(success);
        yield put(
          createAction(ActionType.API_KEY__DELETE_API_KEY_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.API_KEY__DELETE_API_KEY_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowSendApiKey(apiUrl: string): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.API_KEY__SEND_API_KEY> = yield take(
        ActionType.API_KEY__SEND_API_KEY
      );

      yield put(createAction(ActionType.API_KEY__SENDING_API_KEY, null));

      try {
        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const { apiKey, expiredAt } = action.payload;

        const response = yield call(
          [axios, 'request'],
          createRequest<SendApiKeyRequest>(
            'post',
            apiUrl,
            '/send-api-key',
            null,
            {
              apiKey,
              expiredAt,
            },
            {
              accessToken: assertExists(accessToken),
            }
          )
        );

        const { success } = this.sendApiKeyResponseResolver.resolve(
          response.data,
          true
        );

        assertTrue(success);
        yield put(
          createAction(ActionType.API_KEY__SEND_API_KEY_SUCCEEDED, {
            success,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.API_KEY__SEND_API_KEY_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
