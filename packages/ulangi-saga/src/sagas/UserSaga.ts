/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists, assertRequired, assertTrue } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ChangeEmailAndPasswordRequest,
  ChangeEmailRequest,
  ChangePasswordRequest,
  ContactAdminRequest,
} from '@ulangi/ulangi-common/interfaces';
import {
  ChangeEmailAndPasswordResponseResolver,
  ChangeEmailResponseResolver,
  ChangePasswordResponseResolver,
  ContactAdminResponseResolver,
} from '@ulangi/ulangi-common/resolvers';
import { notEndsWith } from '@ulangi/ulangi-common/utils';
import { SessionModel, UserModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import * as Joi from 'joi';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class UserSaga extends ProtectedSaga {
  private changeEmailAndPasswordResponseResolver = new ChangeEmailAndPasswordResponseResolver();
  private changeEmailResponseResolver = new ChangeEmailResponseResolver();
  private changePasswordResponseResolver = new ChangePasswordResponseResolver();
  private contactAdminResponseResolver = new ContactAdminResponseResolver();

  private sharedDb: SQLiteDatabase;
  private userDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private userModel: UserModel;

  public constructor(
    sharedDb: SQLiteDatabase,
    userDb: SQLiteDatabase,
    sessionModel: SessionModel,
    userModel: UserModel
  ) {
    super();
    this.sharedDb = sharedDb;
    this.userDb = userDb;
    this.sessionModel = sessionModel;
    this.userModel = userModel;
  }

  public *run(env: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowChangeEmailAndPassword],
      env.API_URL,
      config.user.passwordMinLength,
      config.general.guestEmailDomain
    );
    yield fork(
      [this, this.allowChangeEmail],
      env.API_URL,
      config.general.guestEmailDomain
    );
    yield fork(
      [this, this.allowChangePassword],
      env.API_URL,
      config.user.passwordMinLength
    );
    yield fork([this, this.allowContactAdmin], env.API_URL);
    yield fork([this, this.allowEdit]);
    yield fork([this, this.allowFetch]);
  }

  public *allowChangeEmailAndPassword(
    apiUrl: string,
    passwordMinLength: number,
    guestDomain: string
  ): IterableIterator<any> {
    while (true) {
      const action: Action<
        ActionType.USER__CHANGE_EMAIL_AND_PASSWORD
      > = yield take(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD);
      const {
        newEmail,
        newPassword,
        confirmPassword,
        currentPassword,
      } = action.payload;

      try {
        assertRequired(
          {
            email: newEmail,
            password: newPassword,
            confirmPassword,
          },
          {
            email: Joi.string()
              .email()
              .regex(notEndsWith(guestDomain), 'notEndsWithGuestDomain'),
            password: Joi.string().min(passwordMinLength),
            confirmPassword: Joi.any().valid(newPassword),
          }
        );

        yield put(
          createAction(ActionType.USER__CHANGING_EMAIL_AND_PASSWORD, null)
        );

        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<ChangeEmailAndPasswordRequest>(
            'post',
            apiUrl,
            '/change-email-and-password',
            null,
            {
              newEmail,
              newPassword,
              currentPassword,
            },
            { accessToken: assertExists(accessToken) }
          )
        );

        const result = this.changeEmailAndPasswordResponseResolver.resolve(
          response.data,
          true
        );
        assertTrue(result.success);
        const newAccessToken = assertExists(result.accessToken);

        yield call(
          [this.sharedDb, 'transaction'],
          (tx: Transaction): void => {
            this.sessionModel.upsertAccessToken(tx, newAccessToken);
          }
        );

        yield put(
          createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_SUCCEEDED, {
            newEmail,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowChangeEmail(
    apiUrl: string,
    guestDomain: string
  ): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.USER__CHANGE_EMAIL> = yield take(
        ActionType.USER__CHANGE_EMAIL
      );
      const { newEmail, currentPassword } = action.payload;

      try {
        // Make sure newEmail valid
        assertRequired(
          { email: newEmail },
          {
            email: Joi.string()
              .email()
              .regex(notEndsWith(guestDomain), 'notEndsWithGuestDomain'),
          }
        );

        yield put(createAction(ActionType.USER__CHANGING_EMAIL, null));

        const accessToken = yield call(
          [this.sessionModel, 'getAccessToken'],
          this.sharedDb
        );

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<ChangeEmailRequest>(
            'post',
            apiUrl,
            '/change-email',
            null,
            {
              newEmail,
              password: currentPassword,
            },
            { accessToken }
          )
        );

        const result = this.changeEmailResponseResolver.resolve(
          response.data,
          true
        );

        assertTrue(result.success);
        const newAccessToken = assertExists(result.accessToken);

        yield call(
          [this.sharedDb, 'transaction'],
          (tx: Transaction): void => {
            this.sessionModel.upsertAccessToken(tx, newAccessToken);
          }
        );

        yield put(
          createAction(ActionType.USER__CHANGE_EMAIL_SUCCEEDED, { newEmail })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__CHANGE_EMAIL_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowChangePassword(
    apiUrl: string,
    passwordMinLength: number
  ): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.USER__CHANGE_PASSWORD> = yield take(
        ActionType.USER__CHANGE_PASSWORD
      );
      const { currentPassword, newPassword, confirmPassword } = action.payload;

      try {
        assertRequired(
          { password: newPassword, confirmPassword },
          {
            password: Joi.string().min(passwordMinLength),
            confirmPassword: Joi.any().valid(newPassword),
          }
        );

        yield put(createAction(ActionType.USER__CHANGING_PASSWORD, null));

        const accessToken = yield call(
          [this.sessionModel, 'getAccessToken'],
          this.sharedDb
        );

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<ChangePasswordRequest>(
            'post',
            apiUrl,
            '/change-password',
            null,
            {
              newPassword,
              currentPassword,
            },
            { accessToken }
          )
        );

        const result = this.changePasswordResponseResolver.resolve(
          response.data,
          true
        );

        assertTrue(result.success);
        const newAccessToken = assertExists(result.accessToken);

        yield call(
          [this.sharedDb, 'transaction'],
          (tx: Transaction): void => {
            this.sessionModel.upsertAccessToken(tx, newAccessToken);
          }
        );
        yield put(
          createAction(ActionType.USER__CHANGE_PASSWORD_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.USER__CHANGE_PASSWORD_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowContactAdmin(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        const action: Action<ActionType.USER__CONTACT_ADMIN> = yield take(
          ActionType.USER__CONTACT_ADMIN
        );
        const { adminEmail, replyToEmail, subject, message } = action.payload;

        yield put(createAction(ActionType.USER__CONTACTING_ADMIN, null));

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<ContactAdminRequest>(
            'post',
            apiUrl,
            '/contact-admin',
            null,
            {
              adminEmail,
              replyToEmail,
              subject,
              message,
            },
            null
          )
        );

        const { success } = this.contactAdminResponseResolver.resolve(
          response.data,
          true
        );

        assertTrue(success);
        yield put(createAction(ActionType.USER__CONTACT_ADMIN_SUCCEEDED, null));
      } catch (error) {
        yield put(
          createAction(ActionType.USER__CONTACT_ADMIN_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowEdit(): IterableIterator<any> {
    while (true) {
      try {
        const action = yield take(ActionType.USER__EDIT);
        const { user: editedUser } = action.payload;

        yield put(createAction(ActionType.USER__EDITING, null));

        const userId = yield call(
          [this.sessionModel, 'getUserId'],
          this.sharedDb
        );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.userModel.updateUser(
              tx,
              {
                ...editedUser,
                userId,
              },
              'local'
            );
          }
        );

        const { user } = yield call(
          [this.userModel, 'getUserById'],
          this.userDb,
          userId,
          true
        );

        yield put(createAction(ActionType.USER__EDIT_SUCCEEDED, { user }));
      } catch (error) {
        yield put(
          createAction(ActionType.USER__EDIT_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowFetch(): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.USER__FETCH);

        yield put(createAction(ActionType.USER__FETCHING, null));

        const userId = yield call(
          [this.sessionModel, 'getUserId'],
          this.sharedDb
        );

        const { user } = yield call(
          [this.userModel, 'getUserById'],
          this.userDb,
          userId,
          true
        );

        yield put(createAction(ActionType.USER__FETCH_SUCCEEDED, { user }));
      } catch (error) {
        yield put(
          createAction(ActionType.USER__FETCH_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
