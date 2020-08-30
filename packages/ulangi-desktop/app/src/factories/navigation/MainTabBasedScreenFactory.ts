import { MainTabBasedScreenDelegate } from '../../delegates/navigation/MainTabBasedScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class MainTabBasedScreenFactory extends ScreenFactory {
  public createScreenDelegate(): MainTabBasedScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new MainTabBasedScreenDelegate(navigatorDelegate);
  }
}
