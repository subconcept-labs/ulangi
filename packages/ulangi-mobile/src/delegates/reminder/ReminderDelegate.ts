/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import * as _ from 'lodash';

export class ReminderDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public setUpReminder(hours: number, minutes: number): void {
    this.eventBus.publish(
      createAction(ActionType.REMINDER__SET_UP_REMINDER, {
        hours,
        minutes,
      }),
    );
  }

  public deleteReminder(): void {
    this.eventBus.publish(
      createAction(ActionType.REMINDER__DELETE_REMINDER, null),
    );
  }

  public requestPermission(callback: {
    onRequesting: () => void;
    onRequestSucceeded: () => void;
    onRequestFailed: (errorBag: ErrorBag) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.REMINDER__REQUEST_PERMISSION, null),
      group(
        on(ActionType.REMINDER__REQUESTING_PERMISSION, callback.onRequesting),
        once(
          ActionType.REMINDER__REQUEST_PERMISSION_SUCCEEDED,
          callback.onRequestSucceeded,
        ),
        once(
          ActionType.REMINDER__REQUEST_PERMISSION_FAILED,
          (errorBag): void => callback.onRequestFailed(errorBag),
        ),
      ),
    );
  }

  public checkPermission(callback?: {
    onChecking: () => void;
    onCheckSucceeded: (hasPermission: boolean) => void;
    onCheckFailed: (errorBag: ErrorBag) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.REMINDER__CHECK_PERMISSION, null),
      typeof callback !== 'undefined'
        ? group(
            on(ActionType.REMINDER__CHECKING_PERMISSION, callback.onChecking),
            once(
              ActionType.REMINDER__CHECK_PERMISSION_SUCCEEDED,
              ({ hasPermission }): void =>
                callback.onCheckSucceeded(hasPermission),
            ),
            once(
              ActionType.REMINDER__CHECK_PERMISSION_FAILED,
              (errorBag): void => callback.onCheckFailed(errorBag),
            ),
          )
        : _.noop,
    );
  }
}
