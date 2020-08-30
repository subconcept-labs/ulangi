import { ButtonSize, ErrorCode, ScreenName } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import {
  AuthDelegate,
  FetchSetDelegate,
  SetListDelegate,
  SyncDelegate,
} from '@ulangi/ulangi-delegate';
import { ObservableSignInScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class SignInScreenDelegate {
  private observableScreen: ObservableSignInScreen;
  private authDelegate: AuthDelegate;
  private setListDelegate: SetListDelegate;
  private fetchSetDelegate: FetchSetDelegate;
  private syncDelegate: SyncDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableSignInScreen,
    authDelegate: AuthDelegate,
    setListDelegate: SetListDelegate,
    fetchSetDelegate: FetchSetDelegate,
    syncDelegate: SyncDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.authDelegate = authDelegate;
    this.setListDelegate = setListDelegate;
    this.fetchSetDelegate = fetchSetDelegate;
    this.syncDelegate = syncDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public signIn(): void {
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
                this.navigatorDelegate.resetToMainTabBasedScreen();
              } else {
                this.syncDelegate.downloadAllSets({
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
                              this.navigatorDelegate.resetToMainTabBasedScreen();
                            },
                          });
                        } else {
                          this.dialogDelegate.dismiss();
                          this.navigatorDelegate.resetToSingleScreen(
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
    this.authDelegate.signInAsGuest({
      onSigningInAsGuest: this.showSigningInAsGuestDialog,
      onSignInAsGuestSucceeded: (): void => {
        this.dialogDelegate.dismiss();
        this.navigatorDelegate.resetToSingleScreen(ScreenName.CREATE_FIRST_SET_SCREEN, {});
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
    this.navigatorDelegate.push(ScreenName.SIGN_UP_SCREEN, {});
  }

  public navigateToForgotPasswordScreen(): void {
    this.navigatorDelegate.push(ScreenName.FORGOT_PASSWORD_SCREEN, {});
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
      title: 'NOTE',
      message:
        'Your flashcards will be downloaded gradually while you use the app.',
      closeOnTouchOutside: false,
      onClose: callback.onClose,
      buttonList: [
        {
          testID: 'OKAY_BTN',
          text: 'OKAY',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
          },
          styles: fullRoundedButtonStyles.getSolidPrimaryBackgroundStyles(
            ButtonSize.SMALL,
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
