/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservablePreloadScreen } from '@ulangi/ulangi-observable';

import { PreloadScreenDelegate } from '../../delegates/preload/PreloadScreenDelegate';
import { SetListDelegate } from '../../delegates/set/SetListDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class PreloadScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservablePreloadScreen,
  ): PreloadScreenDelegate {
    const rootScreenDelegate = this.createRootScreenDelegate();

    const navigatorDelegate = this.createNavigatorDelegate();

    const setListDelegate = new SetListDelegate(this.eventBus);

    return new PreloadScreenDelegate(
      this.eventBus,
      observableScreen,
      setListDelegate,
      rootScreenDelegate,
      navigatorDelegate,
    );
  }
}
