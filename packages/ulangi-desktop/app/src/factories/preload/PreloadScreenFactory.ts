import { SetListDelegate } from '@ulangi/ulangi-delegate';
import { ObservablePreloadScreen } from '@ulangi/ulangi-observable';

import { PreloadScreenDelegate } from '../../delegates/preload/PreloadScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class PreloadScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservablePreloadScreen,
  ): PreloadScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const setListDelegate = new SetListDelegate(this.eventBus);

    return new PreloadScreenDelegate(
      this.eventBus,
      observableScreen,
      setListDelegate,
      navigatorDelegate,
    );
  }
}
