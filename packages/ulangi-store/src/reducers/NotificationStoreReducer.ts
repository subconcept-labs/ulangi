/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import { ObservableNotificationStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class NotificationStoreReducer extends Reducer {
  private notificationStore: ObservableNotificationStore;

  public constructor(notificationStore: ObservableNotificationStore) {
    super();
    this.notificationStore = notificationStore;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.REMINDER__CHECK_PERMISSION_SUCCEEDED)) {
      this.checkPermissionSucceeded(action);
    }
  }

  private checkPermissionSucceeded(
    action: Action<ActionType.REMINDER__CHECK_PERMISSION_SUCCEEDED>
  ): void {
    this.notificationStore.hasPermission = action.payload.hasPermission;
  }
}
