/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName, SyncTask } from '@ulangi/ulangi-common/enums';
import { EventBus, on } from '@ulangi/ulangi-event';
import { ObservableUserStore, Observer } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { env } from '../../constants/env';
import { ManageScreenIds } from '../../constants/ids/ManageScreenIds';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { ReminderDelegate } from '../reminder/ReminderDelegate';
import { ReminderSettingsDelegate } from '../reminder/ReminderSettingsDelegate';
import { RootScreenDelegate } from '../root/RootScreenDelegate';

export class AutorunDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private userStore: ObservableUserStore;
  private reminderDelegate: ReminderDelegate;
  private reminderSettingsDelegate: ReminderSettingsDelegate;
  private dialogDelegate: DialogDelegate;
  private rootScreenDelegate: RootScreenDelegate;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    userStore: ObservableUserStore,
    reminderDelegate: ReminderDelegate,
    reminderSettingsDelegate: ReminderSettingsDelegate,
    dialogDelegate: DialogDelegate,
    rootScreenDelegate: RootScreenDelegate,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.userStore = userStore;
    this.reminderDelegate = reminderDelegate;
    this.reminderSettingsDelegate = reminderSettingsDelegate;
    this.dialogDelegate = dialogDelegate;
    this.rootScreenDelegate = rootScreenDelegate;
  }

  public autorun(): void {
    if (env.OPEN_SOURCE_ONLY === false) {
      this.autoObserveRemoteUpdates();
      this.autoCheckPermissionAndSetUpReminder();
    }

    this.autoCheckUserSession();
    this.uploadLocalChanges();
    this.uploadLessonResults();
    this.autoShowDialogWhenSessionExpired();
    this.autoUpdateRemoteConfig();
    this.autoFetchUserOnDownloadSucceeded();
    this.autoFetchAllSetsOnDownloadSucceeded();
    this.autoObserveLocalUpdates();
  }

  private autoCheckUserSession(): void {
    this.eventBus.publish(createAction(ActionType.USER__CHECK_SESSION, null));
  }

  private uploadLocalChanges(): void {
    this.eventBus.publish(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.UPLOAD_USER,
      }),
    );
    this.eventBus.publish(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.UPLOAD_SETS,
      }),
    );
    this.eventBus.publish(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.UPLOAD_VOCABULARY,
      }),
    );
  }

  private uploadLessonResults(): void {
    this.eventBus.publish(
      createAction(ActionType.LESSON_RESULTS__UPLOAD, null),
    );
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
            createAction(
              ActionType.SYNC__OBSERVE_LOCAL_UPDATES_FOR_SYNCING,
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

  private autoUpdateRemoteConfig(): void {
    this.eventBus.publish(createAction(ActionType.REMOTE_CONFIG__UPDATE, null));
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
