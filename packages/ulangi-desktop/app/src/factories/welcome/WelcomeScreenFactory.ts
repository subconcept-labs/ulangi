import { WelcomeScreenDelegate } from '../../delegates/welcome/WelcomeScreenDelegate';
import { ScreenFactory } from '../../factories/ScreenFactory';

export class WelcomeScreenFactory extends ScreenFactory {
  public createScreenDelegate(): WelcomeScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new WelcomeScreenDelegate(navigatorDelegate);
  }
}
