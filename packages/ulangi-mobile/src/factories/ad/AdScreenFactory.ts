/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAdScreen } from '@ulangi/ulangi-observable';

import { AdDelegate } from '../../delegates/ad/AdDelegate';
import { AdScreenDelegate } from '../../delegates/ad/AdScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class AdScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableAdScreen
  ): AdScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const adDelegate = new AdDelegate(
      this.eventBus,
      this.props.rootStore.adStore,
      this.props.rootStore.userStore,
      this.props.rootStore.remoteConfigStore
    );

    return new AdScreenDelegate(
      this.eventBus,
      observableScreen,
      adDelegate,
      navigatorDelegate
    );
  }
}
