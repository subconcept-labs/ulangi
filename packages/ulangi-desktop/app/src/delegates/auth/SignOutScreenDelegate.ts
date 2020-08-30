/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName, ScreenState } from '@ulangi/ulangi-common/enums';
import { EventBus, once } from '@ulangi/ulangi-event';
import {
  ObservableRootStore,
  ObservableScreenRegistry,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { resetState } from '../../setup/resetState';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class SignOutScreenDelegate {
  private eventBus: EventBus;
  private rootStore: ObservableRootStore;
  private observableScreenRegistry: ObservableScreenRegistry;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    rootStore: ObservableRootStore,
    observableScreenRegistry: ObservableScreenRegistry,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.rootStore = rootStore;
    this.observableScreenRegistry = observableScreenRegistry;
    this.navigatorDelegate = navigatorDelegate;
  }

  public signOut(): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__SIGN_OUT, null),
      once(
        ActionType.USER__SIGN_OUT_SUCCEEDED,
        (): void => {
          resetState(this.rootStore);

          this.getSession({
            onGetSessionSucceeded: (): void => {
              this.navigatorDelegate.resetToSingleScreen(ScreenName.WELCOME_SCREEN, {});
            },
          });
        },
      ),
    );
  }

  public didAllScreenNameUnmountedExceptSignOutScreen(): boolean {
    return !this.observableScreenRegistry.screenList.some(
      (screen): boolean => {
        return (
          screen.screenName !== ScreenName.SIGN_OUT_SCREEN &&
          screen.screenState !== ScreenState.UNMOUNTED
        );
      },
    );
  }

  private getSession(callback: { onGetSessionSucceeded: () => void }): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__GET_SESSION, null),
      once(
        ActionType.USER__GET_SESSION_SUCCEEDED,
        (): void => {
          callback.onGetSessionSucceeded();
        },
      ),
    );
  }
}
