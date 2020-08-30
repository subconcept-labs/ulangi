import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { SetListDelegate } from '@ulangi/ulangi-delegate';
import { EventBus, group, once } from '@ulangi/ulangi-event';
import { ObservablePreloadScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class PreloadScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservablePreloadScreen;
  private setListDelegate: SetListDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservablePreloadScreen,
    setListDelegate: SetListDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.setListDelegate = setListDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public preload(): void {
    this.initializeApp({
      onInitializeSucceededOrAlreadyInitialized: (): void => {
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
  }

  private initializeApp(callback: {
    onInitializeSucceededOrAlreadyInitialized: () => void;
    onInitializeFailed: (error: unknown) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.APP__INITIALIZE, null),
      group(
        once(
          ActionType.APP__INITIALIZE_SUCCEEDED,
          callback.onInitializeSucceededOrAlreadyInitialized,
        ),
        once(
          ActionType.APP__ALREADY_INITIALIZED,
          callback.onInitializeSucceededOrAlreadyInitialized,
        ),
        once(
          ActionType.APP__INITIALIZE_FAILED,
          ({ error }): void => callback.onInitializeFailed(error),
        ),
      ),
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

  private navigateToWelcomeScreen(): void {
    this.navigatorDelegate.resetToSingleScreen(ScreenName.WELCOME_SCREEN, {});
  }

  private navigateToTabBasedScreen(): void {
    this.navigatorDelegate.resetToMainTabBasedScreen();
  }

  private navigateToCreateFirstSetScreen(): void {
    this.navigatorDelegate.resetToSingleScreen(ScreenName.CREATE_FIRST_SET_SCREEN, {});
  }
}
