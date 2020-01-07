/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists, assertRequired, assertTrue } from '@ulangi/assert';
import { Transaction } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  CheckAccessTokenRequest,
  RequestPasswordResetRequest,
  SignInRequest,
  SignUpRequest,
  User,
} from '@ulangi/ulangi-common/interfaces';
import {
  CheckAccessTokenResponseResolver,
  RequestPasswordResetResponseResolver,
  SignInResponseResolver,
  SignUpResponseResolver,
} from '@ulangi/ulangi-common/resolvers';
import { notEndsWith } from '@ulangi/ulangi-common/utils';
import {
  DatabaseFacade,
  SessionModel,
  UserModel,
} from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import * as Joi from 'joi';
import { call, delay, fork, put, spawn, take } from 'redux-saga/effects';
import * as shortuuid from 'short-uuid';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { createRequest } from '../utils/createRequest';
import { PublicSaga } from './PublicSaga';

export class AuthSaga extends PublicSaga {
  private signInResponseResolver = new SignInResponseResolver();
  private signUpResponseResolver = new SignUpResponseResolver();
  private requestPasswordResetResponseResolver = new RequestPasswordResetResponseResolver();
  private checkAccessTokenResponseResolver = new CheckAccessTokenResponseResolver();

  private database: DatabaseFacade;
  private sessionModel: SessionModel;
  private userModel: UserModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    database: DatabaseFacade,
    sessionModel: SessionModel,
    userModel: UserModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.database = database;
    this.sessionModel = sessionModel;
    this.userModel = userModel;
    this.crashlytics = crashlytics;
  }

  public *run(env: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.allowGetSession]);
    yield fork([this, this.allowCheckSession], env.API_URL);
    yield fork([this, this.allowSignIn], env.API_URL);
    yield fork(
      [this, this.allowSignInAsGuest],
      env.API_URL,
      config.general.guestEmailDomain,
      config.general.guestPassword
    );
    yield fork(
      [this, this.allowSignUp],
      env.API_URL,
      config.user.passwordMinLength,
      config.general.guestEmailDomain
    );
    yield fork([this, this.allowRequestPasswordReset], env.API_URL);
  }

  public *allowGetSession(): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.USER__GET_SESSION);
        yield put(createAction(ActionType.USER__GETTING_SESSION, null));

        const sharedDb = this.database.getDb('shared');
        // Check session here
        const userId: PromiseType<
          ReturnType<SessionModel['getUserId']>
        > = yield call([this.sessionModel, 'getUserId'], sharedDb);
        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], sharedDb);

        // User is not authenticated
        if (userId === null || accessToken === null) {
          yield put(
            createAction(ActionType.USER__GET_SESSION_SUCCEEDED, { user: null })
          );
        }
        // User is authenticateed
        else {
          yield call([this, this.setUpAfterAuthenticated], userId, accessToken);

          const userDb = this.database.getDb('user');
          const result: PromiseType<
            ReturnType<UserModel['getUserById']>
          > = yield call([this.userModel, 'getUserById'], userDb, userId, true);

          const { user } = assertExists(result);
          yield put(
            createAction(ActionType.USER__GET_SESSION_SUCCEEDED, { user })
          );
        }
      } catch (error) {
        yield put(
          createAction(ActionType.USER__GET_SESSION_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowCheckSession(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.USER__CHECK_SESSION);
        yield put(createAction(ActionType.USER__CHECKING_SESSION, null));

        const sharedDb = this.database.getDb('shared');

        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], sharedDb);

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<CheckAccessTokenRequest>(
            'post',
            apiUrl,
            '/check-access-token',
            null,
            {
              accessToken: assertExists(accessToken),
            },
            null
          )
        );

        const { valid } = this.checkAccessTokenResponseResolver.resolve(
          response.data,
          true
        );

        yield put(
          createAction(ActionType.USER__CHECK_SESSION_SUCCEEDED, {
            valid,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__CHECK_SESSION_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowSignIn(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        const action: Action<ActionType.USER__SIGN_IN> = yield take(
          ActionType.USER__SIGN_IN
        );
        const { email, password } = action.payload;

        // Make sure email is valid
        assertRequired(
          { email },
          {
            email: Joi.string().email(),
          }
        );

        yield put(createAction(ActionType.USER__SIGNING_IN, null));

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<SignInRequest>(
            'post',
            apiUrl,
            '/sign-in',
            null,
            {
              email,
              password,
            },
            null
          )
        );

        const {
          currentUser,
          accessToken,
        } = this.signInResponseResolver.resolve(response.data, true);
        yield call(
          [this, this.setUpAfterAuthenticated],
          currentUser.userId,
          accessToken
        );
        yield call(
          [this, this.insertUserAndSessionIntoDatabase],
          currentUser,
          accessToken
        );

        yield put(
          createAction(ActionType.USER__SIGN_IN_SUCCEEDED, {
            user: currentUser,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__SIGN_IN_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowSignUp(
    apiUrl: string,
    passwordMinLength: number,
    guestEmailDomain: string
  ): IterableIterator<any> {
    while (true) {
      try {
        const action: Action<ActionType.USER__SIGN_UP> = yield take(
          ActionType.USER__SIGN_UP
        );
        const { email, password, confirmPassword } = action.payload;

        // Password must contains at least 1 char and 1 num
        // Confirm password match password and email is valid
        assertRequired(
          { email, password, confirmPassword },
          {
            email: Joi.string()
              .email()
              .regex(notEndsWith(guestEmailDomain), 'notEndsWithGuestDomain'),
            password: Joi.string().min(passwordMinLength),
            confirmPassword: Joi.any().valid(password),
          }
        );

        yield put(createAction(ActionType.USER__SIGNING_UP, null));

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<SignUpRequest>(
            'post',
            apiUrl,
            '/sign-up',
            null,
            {
              email,
              password,
            },
            null
          )
        );

        const {
          currentUser,
          accessToken,
        } = this.signUpResponseResolver.resolve(response.data, true);
        yield call(
          [this, this.setUpAfterAuthenticated],
          currentUser.userId,
          accessToken
        );
        yield call(
          [this, this.insertUserAndSessionIntoDatabase],
          currentUser,
          accessToken
        );

        yield put(
          createAction(ActionType.USER__SIGN_UP_SUCCEEDED, {
            user: currentUser,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__SIGN_UP_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowSignInAsGuest(
    apiUrl: string,
    guestEmailDomain: string,
    guestPassword: string
  ): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.USER__SIGN_IN_AS_GUEST);

        yield put(createAction(ActionType.USER__SIGNING_IN_AS_GUEST, null));

        const email = shortuuid.generate() + guestEmailDomain;
        const password = guestPassword;

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<SignUpRequest>(
            'post',
            apiUrl,
            '/sign-up',
            null,
            {
              email,
              password,
            },
            null
          )
        );

        const {
          currentUser,
          accessToken,
        } = this.signUpResponseResolver.resolve(response.data, true);
        yield call(
          [this, this.setUpAfterAuthenticated],
          currentUser.userId,
          accessToken
        );
        yield call(
          [this, this.insertUserAndSessionIntoDatabase],
          currentUser,
          accessToken
        );

        yield put(
          createAction(ActionType.USER__SIGN_IN_AS_GUEST_SUCCEEDED, {
            user: currentUser,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__SIGN_IN_AS_GUEST_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
  public *allowRequestPasswordReset(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        const action: Action<
          ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL
        > = yield take(ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL);
        const { email } = action.payload;

        yield put(
          createAction(ActionType.USER__REQUESTING_PASSWORD_RESET_EMAIL, null)
        );

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<RequestPasswordResetRequest>(
            'post',
            apiUrl,
            '/request-password-reset',
            null,
            { email },
            null
          )
        );

        const { success } = this.requestPasswordResetResponseResolver.resolve(
          response.data,
          true
        );
        assertTrue(success);
        yield put(
          createAction(
            ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL_SUCCEEDED,
            null
          )
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  private *allowSignOut(): IterableIterator<any> {
    yield take(ActionType.USER__SIGN_OUT);
    try {
      yield put(createAction(ActionType.USER__SIGNING_OUT, null));

      yield put(createAction(ActionType.ROOT__CANCEL_PROTECTED_SAGAS, null));
      yield take(ActionType.ROOT__CANCEL_PROTECTED_SAGAS_SUCCEEDED);

      // Sometimes we cannot close the db because some transactions are in progress
      let databaseClosed = false;
      while (databaseClosed === false) {
        try {
          // Try closing user database
          yield call([this.database, 'close'], 'user');
          databaseClosed = true;
        } catch (error) {
          yield delay(500);
        }
      }

      const sharedDb = this.database.getDb('shared');
      yield call(
        [sharedDb, 'transaction'],
        (tx: Transaction): void => this.sessionModel.deleteAllSessionValues(tx)
      );

      yield put(createAction(ActionType.USER__SIGN_OUT_SUCCEEDED, null));
    } catch (error) {
      yield put(
        createAction(ActionType.USER__SIGN_OUT_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  private *setUpAfterAuthenticated(
    userId: string,
    accessToken: string
  ): IterableIterator<any> {
    yield put(createAction(ActionType.DATABASE__CONNECT_USER_DB, { userId }));
    yield take(ActionType.DATABASE__CONNECT_USER_DB_SUCCEEDED);

    yield put(createAction(ActionType.DATABASE__CHECK_USER_DB, null));
    yield take(ActionType.DATABASE__CHECK_USER_DB_SUCCEEDED);

    yield put(createAction(ActionType.REMOTE_CONFIG__FETCH, null));
    const action: Action<
      ActionType.REMOTE_CONFIG__FETCH_SUCCEEDED
    > = yield take(ActionType.REMOTE_CONFIG__FETCH_SUCCEEDED);

    yield put(
      createAction(ActionType.ROOT__FORK_PROTECTED_SAGAS, {
        userId,
        accessToken,
        remoteConfig: action.payload.remoteConfig,
      })
    );

    yield take(ActionType.ROOT__FORK_PROTECTED_SAGAS_SUCCEEDED);

    // Use spawn here instead of fork to prevent it to be cancel
    yield spawn([this, this.allowSignOut]);
  }

  private *insertUserAndSessionIntoDatabase(
    currentUser: User,
    accessToken: string
  ): IterableIterator<any> {
    const userDb = this.database.getDb('user');
    const existed = yield call(
      [this.userModel, 'userExists'],
      userDb,
      currentUser.userId
    );
    yield call(
      [userDb, 'transaction'],
      (tx: Transaction): void => {
        if (existed === true) {
          this.userModel.updateUser(tx, currentUser, 'remote');
        } else {
          this.userModel.insertUser(tx, currentUser, 'remote');
        }
      }
    );

    const sharedDb = this.database.getDb('shared');
    yield call(
      [sharedDb, 'transaction'],
      (tx: Transaction): void => {
        this.sessionModel.upsertUserId(tx, currentUser.userId);
        this.sessionModel.upsertAccessToken(tx, accessToken);
      }
    );
  }
}
