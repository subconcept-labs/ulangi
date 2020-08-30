import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableForgotPasswordScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';

@boundClass
export class ForgotPasswordScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableForgotPasswordScreen;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableForgotPasswordScreen,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public requestResetPasswordEmail(): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL, {
        email: this.observableScreen.email.get(),
      }),
      group(
        on(
          ActionType.USER__REQUESTING_PASSWORD_RESET_EMAIL,
          this.showRequestingDialog,
        ),
        once(
          ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL_SUCCEEDED,
          this.showRequestSucceededDialog,
        ),
        once(
          ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL_FAILED,
          (errorBag): void => this.showRequestFailedDialog(errorBag),
        ),
      ),
    );
  }

  public back(): void {
    this.navigatorDelegate.dismissScreen();
  }

  private showRequestingDialog(): void {
    this.dialogDelegate.show({
      message: 'Requesting reset password link. Please wait...',
    });
  }

  private showRequestSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'The reset password link has been sent to your email.',
    });
  }

  private showRequestFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag);
  }
}
