import { ObservableForgotPasswordScreen } from '@ulangi/ulangi-observable';

import { ForgotPasswordScreenDelegate } from '../../delegates/auth/ForgotPasswordScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class ForgotPasswordScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observerScreen: ObservableForgotPasswordScreen,
  ): ForgotPasswordScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate();

    return new ForgotPasswordScreenDelegate(
      this.eventBus,
      observerScreen,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
