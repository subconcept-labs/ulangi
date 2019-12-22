/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { RNFirebase } from '@ulangi/react-native-firebase';

export class NotificationsAdapter {
  private currentReminderChannel?: RNFirebase.notifications.NativeAndroidChannel;
  private unsubscribeNotificationListener?: () => void;

  private notifications: RNFirebase.notifications.Notifications;
  private messaging: RNFirebase.messaging.Messaging;
  private notificationsStatic: RNFirebase.notifications.NotificationsStatics;

  public constructor(
    notifications: RNFirebase.notifications.Notifications,
    messaging: RNFirebase.messaging.Messaging,
    notificationsStatic: RNFirebase.notifications.NotificationsStatics
  ) {
    this.notifications = notifications;
    this.messaging = messaging;
    this.notificationsStatic = notificationsStatic;
  }

  public setUpReminder(time: number): void {
    if (typeof this.currentReminderChannel === 'undefined') {
      this.currentReminderChannel = this.createReminderNotificationChannel();
    }

    if (typeof this.unsubscribeNotificationListener === 'undefined') {
      this.unsubscribeNotificationListener = this.notifications.onNotification(
        async (notification): Promise<void> => {
          await this.notifications.displayNotification(notification);
        }
      );
    }

    this.scheduleReminderNotification(time);
  }

  public cleanUpReminder(): void {
    this.deleteReminderNotificationChannel();

    if (typeof this.unsubscribeNotificationListener !== 'undefined') {
      this.unsubscribeNotificationListener();
    }

    this.cancelReminderNotification();
  }

  public hasPermission(): Promise<boolean> {
    return this.messaging.hasPermission();
  }

  public requestPermission(): Promise<void> {
    return this.messaging.requestPermission();
  }

  private scheduleReminderNotification(time: number): void {
    this.notifications.scheduleNotification(this.buildReminderNotification(), {
      fireDate: time,
      repeatInterval: 'day',
    });
  }

  private cancelReminderNotification(): void {
    this.notifications.cancelNotification('daily-reminder');
  }

  private buildReminderNotification(): RNFirebase.notifications.Notification {
    return new this.notificationsStatic.Notification()
      .setNotificationId('daily-reminder')
      .setTitle('Friendly Reminder')
      .setBody("It's time to review your flashcards.")
      .setSound('default')
      .android.setChannelId('reminder-channel')
      .android.setAutoCancel(true);
  }

  private createReminderNotificationChannel(): RNFirebase.notifications.NativeAndroidChannel {
    const channel = new this.notificationsStatic.Android.Channel(
      'reminder-channel', // channelId
      'Reminder Channel', // channel name
      this.notificationsStatic.Android.Importance.High // channel importance
    ).setDescription('Used for getting reminder notification'); // channel description

    // Create the android notification channel
    this.notifications.android.createChannel(channel);
    return channel;
  }

  private deleteReminderNotificationChannel(): void {
    if (typeof this.currentReminderChannel !== 'undefined') {
      this.notifications.android.deleteChannel(
        this.currentReminderChannel.channelId
      );
      this.currentReminderChannel = undefined;
    }
  }
}
