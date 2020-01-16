/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { call, fork, put, take } from 'redux-saga/effects';

import { NotificationsAdapter } from '../adapters/NotificationsAdapter';
import { errorConverter } from '../converters/ErrorConverter';
import { ProtectedSaga } from './ProtectedSaga';

export class ReminderSaga extends ProtectedSaga {
  private notifications: NotificationsAdapter;

  public constructor(notifications: NotificationsAdapter) {
    super();
    this.notifications = notifications;
  }

  public *run(): IterableIterator<any> {
    yield fork([this, this.allowCheckPermission]);
    yield fork([this, this.allowRequestPermission]);
    yield fork([this, this.allowSetUpReminder]);
    yield fork([this, this.allowDeleteReminder]);
  }

  public *allowCheckPermission(): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.REMINDER__CHECK_PERMISSION);

        const hasPermission = yield call([this.notifications, 'hasPermission']);

        yield put(
          createAction(ActionType.REMINDER__CHECK_PERMISSION_SUCCEEDED, {
            hasPermission,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.REMINDER__CHECK_PERMISSION_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowRequestPermission(): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.REMINDER__REQUEST_PERMISSION);

        yield call([this.notifications, 'requestPermission']);

        yield put(
          createAction(ActionType.REMINDER__REQUEST_PERMISSION_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.REMINDER__REQUEST_PERMISSION_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowSetUpReminder(): IterableIterator<any> {
    while (true) {
      try {
        const action = yield take(ActionType.REMINDER__SET_UP_REMINDER);
        const { hours, minutes } = action.payload;

        const hasPermission = yield call([this.notifications, 'hasPermission']);

        const time = new Date().setHours(hours, minutes);

        if (hasPermission) {
          this.notifications.setUpReminder(time);
          yield put(
            createAction(ActionType.REMINDER__SET_UP_REMINDER_SUCCEEDED, null)
          );
        } else {
          throw new Error(ErrorCode.REMINDER__PERMISSION_REQUIRED);
        }
      } catch (error) {
        yield put(
          createAction(ActionType.REMINDER__SET_UP_REMINDER_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowDeleteReminder(): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.REMINDER__DELETE_REMINDER);
        yield put(createAction(ActionType.REMINDER__DELETING_REMINDER, null));

        yield call([this.notifications, 'cleanUpReminder']);

        yield put(
          createAction(ActionType.REMINDER__DELETE_REMINDER_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.REMINDER__DELETE_REMINDER_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *destroy(): IterableIterator<any> {
    yield put(createAction(ActionType.REMINDER__DELETE_REMINDER, null));
    yield take([
      ActionType.REMINDER__DELETE_REMINDER_SUCCEEDED,
      ActionType.REMINDER__DELETE_REMINDER_FAILED,
    ]);
  }
}
