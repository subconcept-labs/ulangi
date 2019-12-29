/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { EventBus, EventListener, group, on, once } from '@ulangi/ulangi-event';
import { ObservablePreloadScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Platform } from 'react-native';

import { env } from '../../constants/env';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { RootScreenDelegate } from '../root/RootScreenDelegate';
import { SetListDelegate } from '../set/SetListDelegate';

@boundClass
export class PreloadScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservablePreloadScreen;
  private setListDelegate: SetListDelegate;
  private rootScreenDelegate: RootScreenDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservablePreloadScreen,
    setListDelegate: SetListDelegate,
    rootScreenDelegate: RootScreenDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.setListDelegate = setListDelegate;
    this.rootScreenDelegate = rootScreenDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public autoUpdateMessage(): void {
    const contactDeveloperMessage = 'Please contact us at support@ulangi.com';
    const messageMap = [
      [ActionType.APP__INITIALIZING, 'Initializing...'],
      [ActionType.APP__INITIALIZE_SUCCEEDED, 'Initialize succeeded.'],
      [
        ActionType.APP__INITIALIZE_FAILED,
        'Initialize failed. ' + contactDeveloperMessage,
      ],
      [
        ActionType.DATABASE__CONNECTING_SHARED_DB,
        'Connecting shared database...',
      ],
      [
        ActionType.DATABASE__CONNECT_SHARED_DB_SUCCEEDED,
        'Connect shared succeeded.',
      ],
      [
        ActionType.DATABASE__CONNECT_SHARED_DB_FAILED,
        'Connect shared database failed. ' + contactDeveloperMessage,
      ],
      [ActionType.DATABASE__CHECKING_SHARED_DB, 'Checking shared database...'],
      [
        ActionType.DATABASE__CHECK_SHARED_DB_SUCCEEDED,
        'Check shared database succeeded.',
      ],
      [
        ActionType.DATABASE__CHECK_SHARED_DB_FAILED,
        'Check shared database failed. ' + contactDeveloperMessage,
      ],
      [ActionType.USER__GETTING_SESSION, 'Getting user session...'],
      [ActionType.USER__GET_SESSION_SUCCEEDED, 'Get user session succeeded.'],
      [
        ActionType.USER__GET_SESSION_FAILED,
        'Get user session failed. ' + contactDeveloperMessage,
      ],
      [ActionType.DATABASE__CONNECTING_USER_DB, 'Connecting user database...'],
      [
        ActionType.DATABASE__CONNECT_USER_DB_SUCCEEDED,
        'Connect user database succeeded.',
      ],
      [
        ActionType.DATABASE__CONNECT_USER_DB_FAILED,
        'Connect user database failed. ' + contactDeveloperMessage,
      ],
      [ActionType.DATABASE__CHECKING_USER_DB, 'Checking user database failed.'],
      [
        ActionType.DATABASE__CHECK_USER_DB_SUCCEEDED,
        'Checking user database succeeded.',
      ],
      [
        ActionType.DATABASE__CHECK_USER_DB_FAILED,
        'Checking user database failed. ' + contactDeveloperMessage,
      ],
      [
        ActionType.DATABASE__CHECK_USER_DB_TIMEOUT_EXCEEDED,
        'Updating databases but it is taking longer than expected. Please leave the app open until it completes...',
      ],
      [ActionType.REMOTE_CONFIG__FETCHING, 'Fetching remote config...'],
      [
        ActionType.REMOTE_CONFIG__FETCH_SUCCEEDED,
        'Fetch remote config succeeded.',
      ],
      [
        ActionType.REMOTE_CONFIG__FETCH_FAILED,
        'Fetch remote config failed. ' + contactDeveloperMessage,
      ],
      [ActionType.SET__FETCHING_ALL, 'Fetching set data...'],
      [ActionType.SET__FETCH_ALL_SUCCEEDED, 'Fetch set data succeeded.'],
      [
        ActionType.SET__FETCH_ALL_FAILED,
        'Fetch set data failed. ' + contactDeveloperMessage,
      ],
    ];

    this.eventBus.subscribe(
      group(
        ...messageMap.map(
          ([actionType, message]): EventListener => {
            return on(
              actionType,
              (): void => {
                this.observableScreen.message = message;
              },
            );
          },
        ),
      ),
    );
  }

  public preload(): void {
    this.initializeApp({
      onInitializeSucceeded: (): void => {
        this.getSession({
          onSessionFound: (): void => {
            this.fetchAllSets({
              onActiveSetsFound: (setList): void => {
                this.selectFirstActiveSet(setList);
                this.navigateToTabBasedScreen();
              },
              onNoActiveSetsFound: (): void => {
                this.navigateToCreateFirstSetScreen();
              },
            });
          },
          onSessionNotFound: (): void => {
            this.navigateToWelcomeScreen();
          },
        });
      },
      onInitializeFailed: (): void => {
        this.observableScreen.message =
          'Initialize Failed. Please contact developer (support@ulangi.com).';
      },
    });

    this.initializeAppsFlyer();
  }

  private initializeApp(callback: {
    onInitializeSucceeded: () => void;
    onInitializeFailed: (errorCode: string) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.APP__INITIALIZE, null),
      group(
        once(
          ActionType.APP__INITIALIZE_SUCCEEDED,
          callback.onInitializeSucceeded,
        ),
        once(
          ActionType.APP__INITIALIZE_FAILED,
          ({ errorCode }): void => callback.onInitializeFailed(errorCode),
        ),
      ),
    );
  }

  private initializeAppsFlyer(): void {
    this.eventBus.publish(
      createAction(ActionType.APPS_FLYER__INIT_SDK, {
        devKey: Platform.select({
          ios: env.IOS_APPS_FLYER_DEV_KEY,
          android: env.ANDROID_APPS_FLYER_DEV_KEY,
        }),
        isDebug: env.DEBUG_APPS_FLYER,
        appId: env.APPLE_APP_ID,
      }),
    );
  }

  private getSession(callback: {
    onSessionFound: () => void;
    onSessionNotFound: () => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__GET_SESSION, null),
      group(
        once(
          ActionType.USER__GET_SESSION_SUCCEEDED,
          ({ user }): void => {
            if (user !== null) {
              callback.onSessionFound();
            } else {
              callback.onSessionNotFound();
            }
          },
        ),
        once(
          ActionType.USER__GET_SESSION_FAILED,
          (): void => {
            callback.onSessionNotFound();
          },
        ),
      ),
    );
  }

  private fetchAllSets(callback: {
    onActiveSetsFound: (setList: readonly Set[]) => void;
    onNoActiveSetsFound: () => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.SET__FETCH_ALL, null),
      group(
        once(
          ActionType.SET__FETCH_ALL_SUCCEEDED,
          ({ setList }): void => {
            if (this.setListDelegate.hasActiveSets(setList)) {
              callback.onActiveSetsFound(setList);
            } else {
              callback.onNoActiveSetsFound();
            }
          },
        ),
        once(
          ActionType.SET__FETCH_ALL_FAILED,
          (): void => {
            callback.onNoActiveSetsFound();
          },
        ),
      ),
    );
  }

  private selectFirstActiveSet(setList: readonly Set[]): void {
    this.setListDelegate.selectFirstActiveSet(setList);
  }

  private navigateToTabBasedScreen(): void {
    this.rootScreenDelegate.setRootToTabBasedScreen();
  }

  public navigateToCreateFirstSetScreen(): void {
    this.navigatorDelegate.resetTo(ScreenName.CREATE_FIRST_SET_SCREEN, {});
  }

  public navigateToWelcomeScreen(): void {
    this.navigatorDelegate.resetTo(ScreenName.WELCOME_SCREEN, {});
  }
}
