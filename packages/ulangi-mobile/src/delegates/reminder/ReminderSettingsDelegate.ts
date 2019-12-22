/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReminderSettings } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableNotificationStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import * as moment from 'moment';

import { config } from '../../constants/config';

export class ReminderSettingsDelegate {
  private userStore: ObservableUserStore;
  private notificationStore: ObservableNotificationStore;

  public constructor(
    userStore: ObservableUserStore,
    notificationStore: ObservableNotificationStore
  ) {
    this.userStore = userStore;
    this.notificationStore = notificationStore;
  }

  public getCurrentSettings(): ReminderSettings {
    const reminderSettings =
      typeof this.userStore.existingCurrentUser.globalReminder !== 'undefined'
        ? this.userStore.existingCurrentUser.globalReminder
        : config.user.defaultGlobalReminder;

    return reminderSettings;
  }

  public isReminderActive(): boolean {
    return (
      this.notificationStore.hasPermission === true &&
      this.getCurrentSettings().reminderEnabled === true
    );
  }

  public getReadableTime(): string {
    const { hours, minutes } = this.getCurrentSettings();

    return moment()
      .hours(hours)
      .minutes(minutes)
      .format('hh:mm a');
  }
}
