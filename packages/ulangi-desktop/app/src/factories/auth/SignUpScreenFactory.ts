import { SignUpScreenDelegate } from '../../delegates/auth/SignUpScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SignUpScreenFactory extends ScreenFactory {
  public createScreenDelegate(): SignUpScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new SignUpScreenDelegate(navigatorDelegate);
  }
}
