/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { SyncDelegate } from '@ulangi/ulangi-delegate';
import { EventBus, on } from '@ulangi/ulangi-event';
import { ObservableUserStore, Observer } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { env } from '../../constants/env';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class AutorunDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private userStore: ObservableUserStore;
  private syncDelegate: SyncDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    userStore: ObservableUserStore,
    syncDelegate: SyncDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.userStore = userStore;
    this.syncDelegate = syncDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public autorun(): void {
    if (env.OPEN_SOURCE_ONLY === false) {
      this.autoObserveRemoteUpdates();
    }

    this.autoCheckUserSession();
    this.syncEverything();
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

  private syncEverything(): void {
    this.syncDelegate.syncEverything();
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

  private autoShowDialogWhenSessionExpired(): void {
    this.observer.reaction(
      (): null | boolean => this.userStore.existingCurrentUser.isSessionValid,
      (isSessionValid): void => {
        if (isSessionValid === false) {
          this.dialogDelegate.show({
            testID: "SESSION_EXPIRED_DIALOG",
            title: 'SESSION EXPIRED',
            message: 'Session has been expired. Please log back in.',
            showCloseButton: true,
            closeOnTouchOutside: true,
            onClose: (): void => {
              this.navigatorDelegate.resetToSingleScreen(
                ScreenName.SIGN_OUT_SCREEN,
                {}
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
