/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { EventBus, on } from '@ulangi/ulangi-event';
import { ObservableUserStore, Observer } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { config } from '../../constants/config';
import { env } from '../../constants/env';
import { ManageScreenIds } from '../../constants/ids/ManageScreenIds';
import { AdDelegate } from '../ad/AdDelegate';
import { DataSharingDelegate } from '../data-sharing/DataSharingDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { ReminderDelegate } from '../reminder/ReminderDelegate';
import { ReminderSettingsDelegate } from '../reminder/ReminderSettingsDelegate';
import { RootScreenDelegate } from '../root/RootScreenDelegate';

export class AutorunDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private userStore: ObservableUserStore;
  private adDelegate: AdDelegate;
  private reminderDelegate: ReminderDelegate;
  private reminderSettingsDelegate: ReminderSettingsDelegate;
  private dataSharingDelegate: DataSharingDelegate;
  private dialogDelegate: DialogDelegate;
  private rootScreenDelegate: RootScreenDelegate;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    userStore: ObservableUserStore,
    adDelegate: AdDelegate,
    reminderDelegate: ReminderDelegate,
    reminderSettingsDelegate: ReminderSettingsDelegate,
    dataSharingDelegate: DataSharingDelegate,
    dialogDelegate: DialogDelegate,
    rootScreenDelegate: RootScreenDelegate,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.userStore = userStore;
    this.adDelegate = adDelegate;
    this.reminderDelegate = reminderDelegate;
    this.reminderSettingsDelegate = reminderSettingsDelegate;
    this.dataSharingDelegate = dataSharingDelegate;
    this.dialogDelegate = dialogDelegate;
    this.rootScreenDelegate = rootScreenDelegate;
  }

  public autorun(): void {
    this.autoInitIap();

    if (config.user.autoCheckUserSessionAfterAuth === true) {
      this.autoCheckUserSession();
    }

    if (config.user.autoFetchOnDownloadSucceededAfterAuth === true) {
      this.autoFetchUserOnDownloadSucceeded();
    }

    if (config.set.autoFetchAllOnDownloadSucceededAfterAuth === true) {
      this.autoFetchAllSetsOnDownloadSucceeded();
    }

    if (config.sync.autoObserveLocalUpdatesAfterAuth) {
      this.autoObserveLocalUpdates();
    }

    if (config.sync.autoObserveRemoteUpdatesAfterAuth) {
      this.autoObserveRemoteUpdates();
    }

    if (config.ad.autoSetUpAfterAuth) {
      this.autoSetUpAd();
    }

    if (config.ad.autoInitializeAfterAuth) {
      this.autoInitializeAd();
    }

    if (config.remoteConfig.autoUpdateAfterAuth) {
      this.autoUpdateRemoteConfig();
    }

    if (config.audio.autoClearCacheAfterAuth) {
      this.autoClearAudioCache();
    }

    if (config.reminder.autoCheckPermissionAndSetUpReminder) {
      this.autoCheckPermissionAndSetUpReminder();
    }

    this.autoToggleDataSharing();

    this.autoShowDialogWhenSessionExpired();
  }

  private autoInitIap(): void {
    if (env.GOOGLE_PACKAGE_NAME !== null) {
      this.eventBus.publish(
        createAction(ActionType.IAP__INIT, {
          googlePackageName: env.GOOGLE_PACKAGE_NAME,
        }),
      );
    } else {
      console.warn('IAP is not configured. Missing GOOGLE_PACKAGE_NAME');
    }
  }

  private autoCheckUserSession(): void {
    this.eventBus.publish(createAction(ActionType.USER__CHECK_SESSION, null));
  }

  private autoFetchUserOnDownloadSucceeded(): void {
    this.eventBus.subscribe(
      on(
        ActionType.USER__DOWNLOAD_USER_SUCCEEDED,
        (): void => {
          this.eventBus.publish(createAction(ActionType.USER__FETCH, null));
        },
      ),
    );
  }

  private autoFetchAllSetsOnDownloadSucceeded(): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.SET__DOWNLOAD_SETS_SUCCEEDED,
          ActionType.SET__DOWNLOAD_INCOMPATIBLE_SETS_SUCCEEDED,
        ],
        (): void => {
          this.eventBus.publish(createAction(ActionType.SET__FETCH_ALL, null));
        },
      ),
    );
  }

  private autoObserveLocalUpdates(): void {
    this.observer.reaction(
      (): null | boolean => this.userStore.existingCurrentUser.isSessionValid,
      (isSessionValid): void => {
        if (isSessionValid === true) {
          this.eventBus.publish(
            createAction(ActionType.SYNC__OBSERVE_LOCAL_UPDATES_FOR_SYNCING, {
              addUploadTasks: true,
            }),
          );
        }
      },
      {
        fireImmediately: true,
      },
    );
  }

  private autoObserveRemoteUpdates(): void {
    this.observer.reaction(
      (): null | boolean => this.userStore.existingCurrentUser.isSessionValid,
      (isSessionValid): void => {
        if (isSessionValid === true) {
          this.eventBus.publish(
            createAction(
              ActionType.SYNC__OBSERVE_REMOTE_UPDATES_FOR_SYNCING,
              null,
            ),
          );
        }
      },
      {
        fireImmediately: true,
      },
    );
  }

  private autoSetUpAd(): void {
    this.observer.autorun(
      (): void => {
        if (this.adDelegate.shouldSetUp()) {
          this.adDelegate.setUp();
        }
      },
    );
  }

  private autoInitializeAd(): void {
    this.observer.autorun(
      (): void => {
        if (this.adDelegate.shouldInitialize()) {
          this.adDelegate.initialize();
        }
      },
    );
  }

  private autoToggleDataSharing(): void {
    this.dataSharingDelegate.autoToggleDataSharing();
  }

  private autoUpdateRemoteConfig(): void {
    this.eventBus.publish(createAction(ActionType.REMOTE_CONFIG__UPDATE, null));
  }

  private autoClearAudioCache(): void {
    this.eventBus.publish(
      createAction(ActionType.AUDIO__CLEAR_SYNTHESIZED_SPEECH_CACHE, null),
    );
  }

  private autoCheckPermissionAndSetUpReminder(): void {
    this.observer.reaction(
      (): { reminderEnabled: boolean; hours: number; minutes: number } => {
        return this.reminderSettingsDelegate.getCurrentSettings();
      },
      ({ reminderEnabled, hours, minutes }): void => {
        if (reminderEnabled === true) {
          this.reminderDelegate.checkPermission({
            onChecking: _.noop,
            onCheckSucceeded: (hasPermission): void => {
              if (hasPermission === true) {
                this.reminderDelegate.setUpReminder(hours, minutes);
              } else {
                this.reminderDelegate.deleteReminder();
              }
            },
            onCheckFailed: _.noop,
          });
        } else {
          this.reminderDelegate.deleteReminder();
        }
      },
      {
        fireImmediately: true,
      },
    );
  }

  private autoShowDialogWhenSessionExpired(): void {
    this.observer.reaction(
      (): null | boolean => this.userStore.existingCurrentUser.isSessionValid,
      (isSessionValid): void => {
        if (isSessionValid === false) {
          this.dialogDelegate.show({
            testID: ManageScreenIds.SESSION_EXPIRED_DIALOG,
            title: 'SESSION EXPIRED',
            message: 'Session has been expired. Please log back in.',
            showCloseButton: true,
            closeOnTouchOutside: true,
            onClose: (): void => {
              this.rootScreenDelegate.setRootToSingleScreen(
                ScreenName.SIGN_OUT_SCREEN,
              );
            },
          });
        }
      },
      {
        fireImmediately: true,
      },
    );
  }
}
