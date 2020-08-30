import { ScreenName } from '@ulangi/ulangi-common/enums';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class MainTabBasedScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
  }

  public logOut(): void {
    this.navigatorDelegate.resetToSingleScreen(
      ScreenName.SIGN_OUT_SCREEN, {},
    );
  }
}
