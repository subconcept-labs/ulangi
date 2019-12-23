/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ButtonSize,
  ErrorCode,
  ScreenName,
  SyncTask,
} from '@ulangi/ulangi-common/enums';
import { EventBus, once } from '@ulangi/ulangi-event';
import {
  ObservableKeyboard,
  ObservableSignInScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { SignInScreenIds } from '../../constants/ids/SignInScreenIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { SingleScreenStyle } from '../../styles/SingleScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { RootScreenDelegate } from '../root/RootScreenDelegate';
import { FetchSetDelegate } from '../set/FetchSetDelegate';
import { SetListDelegate } from '../set/SetListDelegate';
import { AuthDelegate } from './AuthDelegate';

@boundClass
export class SignInScreenDelegate {
  private errorConverter = new ErrorConverter();

  private eventBus: EventBus;
  private observer: Observer;
  private observableKeyboard: ObservableKeyboard;
  private observableScreen: ObservableSignInScreen;
  private authDelegate: AuthDelegate;
  private setListDelegate: SetListDelegate;
  private fetchSetDelegate: FetchSetDelegate;
  private rootScreenDelegate: RootScreenDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    observableKeyboard: ObservableKeyboard,
    observableScreen: ObservableSignInScreen,
    authDelegate: AuthDelegate,
    setListDelegate: SetListDelegate,
    fetchSetDelegate: FetchSetDelegate,
    rootScreenDelegate: RootScreenDelegate,
    navigatorDelegate: NavigatorDelegate,
    analytics: AnalyticsAdapter,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.observableKeyboard = observableKeyboard;
    this.observableScreen = observableScreen;
    this.authDelegate = authDelegate;
    this.setListDelegate = setListDelegate;
    this.fetchSetDelegate = fetchSetDelegate;
    this.rootScreenDelegate = rootScreenDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.analytics = analytics;
  }

  public signIn(): void {
    this.analytics.logEvent('sign_in');
    Keyboard.dismiss();
    this.authDelegate.signIn(
      this.observableScreen.email.get(),
      this.observableScreen.password.get(),
      {
        onSigningIn: this.showSigningInDialog,
        onSignInSucceeded: (): void =>
          this.fetchSetDelegate.fetchAllSets({
            onFetchingAll: this.showFetchingDataDialog,
            onFetchAllSucceeded: (setList): void => {
              if (this.setListDelegate.hasActiveSets(setList)) {
                this.setListDelegate.selectFirstActiveSet(setList);
                this.navigatorDelegate.dismissLightBox();
                this.rootScreenDelegate.setRootToTabBasedScreen();
              } else {
                this.downloadAllSets({
                  onDownloadCompleted: (): void =>
                    this.fetchSetDelegate.fetchAllSets({
                      onFetchingAll: this.showFetchingDataDialog,
                      onFetchAllSucceeded: (setList): void => {
                        if (this.setListDelegate.hasActiveSets(setList)) {
                          this.showSyncingInProgressDialog({
                            onClose: (): void => {
                              this.setListDelegate.selectFirstActiveSet(
                                setList,
                              );
                              this.rootScreenDelegate.setRootToTabBasedScreen();
                            },
                          });
                        } else {
                          this.navigatorDelegate.dismissLightBox();
                          this.navigatorDelegate.resetTo(
                            ScreenName.CREATE_FIRST_SET_SCREEN,
                            {},
                          );
                        }
                      },
                      onFetchAllFailed: this.showFetchDataFailedDialog,
                    }),
                });
              }
            },
            onFetchAllFailed: this.showFetchDataFailedDialog,
          }),
        onSignInFailed: this.showSignInFailedDialog,
      },
    );
  }

  public signInAsGuest(): void {
    this.analytics.logEvent('sign_in_as_guest');
    this.authDelegate.signInAsGuest({
      onSigningInAsGuest: this.showSigningInAsGuestDialog,
      onSignInAsGuestSucceeded: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.resetTo(ScreenName.CREATE_FIRST_SET_SCREEN, {});
      },
      onSignInAsGuestFailed: (errorCode): void => {
        if (errorCode === ErrorCode.USER__EMAIL_ALREADY_REGISTERED) {
          this.signInAsGuest();
        } else {
          this.showSigningInAsGuestFailedDialog(errorCode);
        }
      },
    });
  }

  public navigateToSignUpScreen(): void {
    Keyboard.dismiss();
    this.observer.when(
      (): boolean => this.observableKeyboard.state === 'hidden',
      (): void => this.navigatorDelegate.push(ScreenName.SIGN_UP_SCREEN, {}),
    );
  }

  public navigateToForgotPasswordScreen(): void {
    Keyboard.dismiss();
    this.observer.when(
      (): boolean => this.observableKeyboard.state === 'hidden',
      (): void =>
        this.navigatorDelegate.push(ScreenName.FORGOT_PASSWORD_SCREEN, {}),
    );
  }

  private downloadAllSets(callback: { onDownloadCompleted: () => void }): void {
    this.eventBus.pubsub(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.DOWNLOAD_SETS,
      }),
      once(ActionType.SYNC__SYNC_COMPLETED, callback.onDownloadCompleted),
    );
  }

  private showSigningInDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Signing in. Please wait...',
      },
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showSignInFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        title: 'SIGN-IN FAILED',
        message: this.errorConverter.convertToMessage(errorCode),
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showFetchingDataDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Fetching data. Please wait...',
      },
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showFetchDataFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        title: 'FETCH DATA FAILED',
        message: this.errorConverter.convertToMessage(errorCode),
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showSyncingInProgressDialog(callback: { onClose: () => void }): void {
    this.navigatorDelegate.showDialog(
      {
        testID: SignInScreenIds.SYNCING_DIALOG,
        title: 'NOTE',
        message:
          'Your flashcards will be downloaded gradually while you use the app.',
        closeOnTouchOutside: false,
        onClose: callback.onClose,
        buttonList: [
          {
            testID: LightBoxDialogIds.OKAY_BTN,
            text: 'OKAY',
            onPress: (): void => {
              this.navigatorDelegate.dismissLightBox();
            },
            styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
        ],
      },
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showSigningInAsGuestDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Creating an account. Please wait...',
      },
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showSigningInAsGuestFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        title: 'FAILED TO SIGN IN AS GUEST',
        message: this.errorConverter.convertToMessage(errorCode),
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }
}
