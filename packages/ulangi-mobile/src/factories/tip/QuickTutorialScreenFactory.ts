/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableQuickTutorialScreen } from '@ulangi/ulangi-observable';

import { QuickTutorialScreenDelegate } from '../../delegates/tip/QuickTutorialScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class QuickTutorialScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableQuickTutorialScreen,
  ): QuickTutorialScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new QuickTutorialScreenDelegate(
      observableScreen,
      navigatorDelegate,
      this.props.analytics,
    );
  }
}
