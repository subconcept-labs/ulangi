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
import { ButtonStyles, ErrorBag } from '@ulangi/ulangi-common/interfaces';
import {
  AuthDelegate,
  FetchSetDelegate,
  SetListDelegate,
} from '@ulangi/ulangi-delegate';
import { EventBus, once } from '@ulangi/ulangi-event';
import {
  ObservableKeyboard,
  ObservableSignInScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

import { RemoteLogger } from '../../RemoteLogger';
import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { SignInScreenIds } from '../../constants/ids/SignInScreenIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { RootScreenDelegate } from '../root/RootScreenDelegate';

@boundClass
export class SignInScreenDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private observableKeyboard: ObservableKeyboard;
  private observableScreen: ObservableSignInScreen;
  private authDelegate: AuthDelegate;
  private setListDelegate: SetListDelegate;
  private fetchSetDelegate: FetchSetDelegate;
  private rootScreenDelegate: RootScreenDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    observableKeyboard: ObservableKeyboard,
    observableScreen: ObservableSignInScreen,
    authDelegate: AuthDelegate,
    setListDelegate: SetListDelegate,
    fetchSetDelegate: FetchSetDelegate,
    rootScreenDelegate: RootScreenDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.observableKeyboard = observableKeyboard;
    this.observableScreen = observableScreen;
    this.authDelegate = authDelegate;
    this.setListDelegate = setListDelegate;
    this.fetchSetDelegate = fetchSetDelegate;
    this.rootScreenDelegate = rootScreenDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public signIn(): void {
    RemoteLogger.logEvent('sign_in');
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
                this.dialogDelegate.dismiss();
                this.rootScreenDelegate.setRootToTabBasedScreen();
              } else {
                this.downloadAllSets({
                  onDownloadCompleted: (): void =>
                    this.fetchSetDelegate.fetchAllSets({
                      onFetchingAll: this.showFetchingDataDialog,
                      onFetchAllSucceeded: (newSetList): void => {
                        if (this.setListDelegate.hasActiveSets(newSetList)) {
                          this.showSyncingInProgressDialog({
                            onClose: (): void => {
                              this.setListDelegate.selectFirstActiveSet(
                                newSetList,
                              );
                              this.rootScreenDelegate.setRootToTabBasedScreen();
                            },
                          });
                        } else {
                          this.dialogDelegate.dismiss();
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
    RemoteLogger.logEvent('sign_in_as_guest');
    this.authDelegate.signInAsGuest({
      onSigningInAsGuest: this.showSigningInAsGuestDialog,
      onSignInAsGuestSucceeded: (): void => {
        this.dialogDelegate.dismiss();
        this.navigatorDelegate.resetTo(ScreenName.CREATE_FIRST_SET_SCREEN, {});
      },
      onSignInAsGuestFailed: (errorBag): void => {
        if (errorBag.errorCode === ErrorCode.USER__EMAIL_ALREADY_REGISTERED) {
          this.signInAsGuest();
        } else {
          this.showSigningInAsGuestFailedDialog(errorBag);
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
    this.dialogDelegate.show({
      message: 'Signing in. Please wait...',
    });
  }

  private showSignInFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'SIGN-IN FAILED',
    });
  }

  private showFetchingDataDialog(): void {
    this.dialogDelegate.show({
      message: 'Fetching data. Please wait...',
    });
  }

  private showFetchDataFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'FETCH DATA FAILED',
    });
  }

  private showSyncingInProgressDialog(callback: { onClose: () => void }): void {
    this.dialogDelegate.show({
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
          responsiveStyles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidPrimaryBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
      ],
    });
  }

  private showSigningInAsGuestDialog(): void {
    this.dialogDelegate.show({
      message: 'Creating an account. Please wait...',
    });
  }

  private showSigningInAsGuestFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'FAILED TO SIGN IN AS GUEST',
    });
  }
}
