/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserBuilder } from '@ulangi/ulangi-common/builders';
import { ErrorCode, UserExtraDataName } from '@ulangi/ulangi-common/enums';
import {
  ChangeEmailAndPasswordRequest,
  ChangeEmailRequest,
  ChangePasswordRequest,
  ContactAdminRequest,
  User,
} from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import { SessionModel, UserModel } from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { createRequest } from '../utils/createRequest';
import { UserSaga } from './UserSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  SessionModel: SessionModelMock,
  UserModel: UserModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('UserSaga', (): void => {
  const apiUrl = 'http://localhost';
  const passwordMinLength = 8;
  const guestEmailDomain = '@gu.est';

  describe('Tests start with all mocked modules', (): void => {
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedUserModel: jest.Mocked<UserModel>;
    let userSaga: UserSaga;
    let saga: ExpectApi;
    let restoreCurrentTime: () => void;

    beforeEach(
      (): void => {
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSessionModel = new SessionModelMock();
        mockedUserModel = new UserModelMock();

        userSaga = new UserSaga(
          mockedSharedDatabase,
          mockedUserDatabase,
          mockedSessionModel,
          mockedUserModel
        );

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    describe('Test allowChangeEmailAndPassword', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(
            userSaga.allowChangeEmailAndPassword.bind(
              userSaga,
              apiUrl,
              passwordMinLength,
              guestEmailDomain
            )
          );
        }
      );

      test('change email and password success flow', async (): Promise<
        void
      > => {
        const newEmail = 'test@ulangi.com';
        const newPassword = 'newpassword';
        const currentPassword = 'password';
        const accessToken = 'accessToken';
        const newAccessToken = 'newAccessToken';

        const response = {
          data: {
            success: true,
            accessToken: newAccessToken,
          },
        };

        await saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [matchers.call.fn(axios.request), response],
          ])
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD, {
              newEmail: newEmail,
              newPassword,
              confirmPassword: newPassword,
              currentPassword,
            })
          )
          .put(createAction(ActionType.USER__CHANGING_EMAIL_AND_PASSWORD, null))
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
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
              { accessToken }
            )
          )
          .call.fn(mockedSharedDatabase.transaction)
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_SUCCEEDED, {
              newEmail,
            })
          )
          .silentRun();

        expect(mockedSessionModel.upsertAccessToken).toHaveBeenCalledWith(
          mockedTransaction,
          newAccessToken
        );
      });

      test('change email and password failed because guest domain is used', async (): Promise<
        void
      > => {
        const newEmail = 'test' + guestEmailDomain;
        const newPassword = 'newpassword';
        const currentPassword = 'password';
        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD, {
              newEmail,
              newPassword,
              confirmPassword: newPassword,
              currentPassword,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_FAILED, {
              errorCode: ErrorCode.USER__INVALID_EMAIL,
              error: ErrorCode.USER__INVALID_EMAIL,
            })
          )
          .silentRun();
      });

      test('change email and password failed if email is invalid', async (): Promise<
        void
      > => {
        const newEmail = 'test';
        const newPassword = 'newpassword';
        const currentPassword = 'password';
        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD, {
              newEmail,
              newPassword,
              confirmPassword: newPassword,
              currentPassword,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_FAILED, {
              errorCode: ErrorCode.USER__INVALID_EMAIL,
              error: ErrorCode.USER__INVALID_EMAIL,
            })
          )
          .silentRun();
      });

      test('change email and password failed because password mismatched', async (): Promise<
        void
      > => {
        const newEmail = 'test@ulangi.com';
        const newPassword = 'newpassword';
        const currentPassword = 'password';
        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD, {
              newEmail,
              newPassword,
              confirmPassword: 'confirmpassword',
              currentPassword,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_FAILED, {
              errorCode: ErrorCode.USER__CONFIRM_PASSWORD_MISMATCHED,
              error: ErrorCode.USER__CONFIRM_PASSWORD_MISMATCHED,
            })
          )
          .silentRun();
      });

      test('change email and password failed because password is too short', async (): Promise<
        void
      > => {
        const newEmail = 'test@ulangi.com';
        const newPassword = 'new';
        const currentPassword = 'password';
        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD, {
              newEmail,
              newPassword,
              confirmPassword: newPassword,
              currentPassword,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_FAILED, {
              errorCode: ErrorCode.USER__WEAK_PASSWORD,
              error: ErrorCode.USER__WEAK_PASSWORD,
            })
          )
          .silentRun();
      });
    });

    describe('Test allowChangeEmail', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(
            userSaga.allowChangeEmail.bind(userSaga, apiUrl, guestEmailDomain)
          );
        }
      );

      test('change email success flow', async (): Promise<void> => {
        const email = 'test@ulangi.com';
        const password = 'password';
        const accessToken = 'accessToken';
        const newAccessToken = 'newAccessToken';

        const response = {
          data: {
            success: true,
            accessToken: newAccessToken,
          },
        };

        await saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [matchers.call.fn(axios.request), response],
          ])
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL, {
              newEmail: email,
              currentPassword: password,
            })
          )
          .put(createAction(ActionType.USER__CHANGING_EMAIL, null))
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [axios, 'request'],
            createRequest<ChangeEmailRequest>(
              'post',
              apiUrl,
              '/change-email',
              null,
              {
                newEmail: email,
                password,
              },
              { accessToken }
            )
          )
          .call.fn(mockedSharedDatabase.transaction)
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_SUCCEEDED, {
              newEmail: email,
            })
          )
          .silentRun();

        expect(mockedSessionModel.upsertAccessToken).toHaveBeenCalledWith(
          mockedTransaction,
          newAccessToken
        );
      });

      test('change email failed because guest domain is used', async (): Promise<
        void
      > => {
        const email = 'test' + guestEmailDomain;
        const password = 'password';
        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL, {
              newEmail: email,
              currentPassword: password,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_FAILED, {
              errorCode: ErrorCode.USER__INVALID_EMAIL,
              error: ErrorCode.USER__INVALID_EMAIL,
            })
          )
          .silentRun();
      });

      test('change email failed if email is invalid', async (): Promise<
        void
      > => {
        const email = 'test';
        const password = 'password';
        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_EMAIL, {
              newEmail: email,
              currentPassword: password,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_EMAIL_FAILED, {
              errorCode: ErrorCode.USER__INVALID_EMAIL,
              error: ErrorCode.USER__INVALID_EMAIL,
            })
          )
          .silentRun();
      });
    });

    describe('Test allowChangePassword', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(
            userSaga.allowChangePassword.bind(
              userSaga,
              apiUrl,
              passwordMinLength
            )
          );
        }
      );

      test('change password success flow', async (): Promise<void> => {
        const currentPassword = 'password';
        const newPassword = 'newPassword';
        const accessToken = 'accessToken';
        const newAccessToken = 'newAccessToken';

        const response = {
          data: {
            success: true,
            accessToken: newAccessToken,
          },
        };
        await saga
          .provide([
            [
              matchers.call.fn(mockedSessionModel.getAccessToken),
              'accessToken',
            ],
            [matchers.call.fn(axios.request), response],
          ])
          .dispatch(
            createAction(ActionType.USER__CHANGE_PASSWORD, {
              currentPassword,
              newPassword,
              confirmPassword: newPassword,
            })
          )
          .put(createAction(ActionType.USER__CHANGING_PASSWORD, null))
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
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
          )
          .call.fn(mockedSharedDatabase.transaction)
          .put(createAction(ActionType.USER__CHANGE_PASSWORD_SUCCEEDED, null))
          .silentRun();

        expect(mockedSessionModel.upsertAccessToken).toHaveBeenCalledWith(
          mockedTransaction,
          newAccessToken
        );
      });

      test('change password failed if new password too short', async (): Promise<
        void
      > => {
        const currentPassword = 'currentPassword';
        const newPassword = 'test';

        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_PASSWORD, {
              currentPassword,
              newPassword,
              confirmPassword: newPassword,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_PASSWORD_FAILED, {
              errorCode: ErrorCode.USER__WEAK_PASSWORD,
              error: ErrorCode.USER__WEAK_PASSWORD,
            })
          )
          .silentRun();
      });

      test('change password failed if confirm password mismatched', async (): Promise<
        void
      > => {
        const currentPassword = 'currentPassword';
        const newPassword = 'newPassword';
        const confirmPassword = 'confirmPssword';

        await saga
          .dispatch(
            createAction(ActionType.USER__CHANGE_PASSWORD, {
              currentPassword,
              newPassword,
              confirmPassword,
            })
          )
          .put(
            createAction(ActionType.USER__CHANGE_PASSWORD_FAILED, {
              errorCode: ErrorCode.USER__CONFIRM_PASSWORD_MISMATCHED,
              error: ErrorCode.USER__CONFIRM_PASSWORD_MISMATCHED,
            })
          )
          .silentRun();
      });
    });

    describe('Test allowContactAdmin', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(userSaga.allowContactAdmin.bind(userSaga, apiUrl));
        }
      );

      test('contact admin success flow', async (): Promise<void> => {
        const adminEmail = 'admin@ulangi.com';
        const replyToEmail = 'reply@ulangi.com';
        const subject = 'subject';
        const message = 'message';

        const response = {
          data: { success: true },
        };

        await saga
          .provide([[matchers.call.fn(axios.request), response]])
          .dispatch(
            createAction(ActionType.USER__CONTACT_ADMIN, {
              adminEmail,
              replyToEmail,
              subject,
              message,
            })
          )
          .put(createAction(ActionType.USER__CONTACTING_ADMIN, null))
          .call(
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
          )
          .put(createAction(ActionType.USER__CONTACT_ADMIN_SUCCEEDED, null))
          .silentRun();
      });

      test('contact admin failed for unknown reason', async (): Promise<
        void
      > => {
        const adminEmail = 'admin@ulangi.com';
        const replyToEmail = 'reply@ulangi.com';
        const subject = 'subject';
        const message = 'message';

        const response = {
          data: { success: false },
        };

        await saga
          .provide([[matchers.call.fn(axios.request), response]])
          .dispatch(
            createAction(ActionType.USER__CONTACT_ADMIN, {
              adminEmail,
              replyToEmail,
              subject,
              message,
            })
          )
          .put(createAction(ActionType.USER__CONTACTING_ADMIN, null))
          .call(
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
          )
          .put(
            createAction(ActionType.USER__CONTACT_ADMIN_FAILED, {
              errorCode: ErrorCode.GENERAL__UNKNOWN_ERROR,
              error: ErrorCode.GENERAL__UNKNOWN_ERROR,
            })
          )
          .silentRun();
      });
    });

    describe('Test allowEdit', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(userSaga.allowEdit.bind(userSaga));
        }
      );

      test('edit success flow', async (): Promise<void> => {
        const editedUser: DeepPartial<User> = {
          userId: 'userId',
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 10,
                writingLevelThreshold: 10,
              },
              createdAt: moment().toDate(),
              updatedAt: moment().toDate(),
              firstSyncedAt: null,
              lastSyncedAt: null,
            },
          ],
        };

        const updatedUser = new UserBuilder().build(editedUser);

        await saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getUserId), editedUser.userId],
            [
              matchers.call.fn(mockedUserModel.getUserById),
              { user: updatedUser },
            ],
          ])
          .dispatch(
            createAction(ActionType.USER__EDIT, {
              user: editedUser,
            })
          )
          .put(createAction(ActionType.USER__EDITING, null))
          .call([mockedSessionModel, 'getUserId'], mockedSharedDatabase)
          .call.fn(mockedUserDatabase.transaction)
          .call(
            [mockedUserModel, 'getUserById'],
            mockedUserDatabase,
            editedUser.userId,
            true
          )
          .put(
            createAction(ActionType.USER__EDIT_SUCCEEDED, { user: updatedUser })
          )
          .silentRun();

        expect(mockedUserModel.updateUser).toHaveBeenCalledWith(
          mockedTransaction,
          editedUser,
          'local'
        );
      });
    });

    describe('Test allowFetch', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(userSaga.allowFetch.bind(userSaga));
        }
      );

      test('fetch success flow', async (): Promise<void> => {
        const user = new UserBuilder().build({});
        await saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getUserId), user.userId],
            [matchers.call.fn(mockedUserModel.getUserById), { user }],
          ])
          .dispatch(createAction(ActionType.USER__FETCH, null))
          .put(createAction(ActionType.USER__FETCHING, null))
          .call([mockedSessionModel, 'getUserId'], mockedSharedDatabase)
          .call(
            [mockedUserModel, 'getUserById'],
            mockedUserDatabase,
            user.userId,
            true
          )
          .put(createAction(ActionType.USER__FETCH_SUCCEEDED, { user }))
          .silentRun();
      });
    });
  });
});
