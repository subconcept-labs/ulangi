import { ScreenName } from '@ulangi/ulangi-common/enums';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class WelcomeScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
  }

  public signInAsGuest(): void {}

  public navigateToSignInScreen(): void {
    this.navigatorDelegate.push(ScreenName.SIGN_IN_SCREEN, {});
  }
}
