/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSetUpAccountScreen } from '@ulangi/ulangi-observable';

import { SetUpAccountScreenDelegate } from '../../delegates/account/SetUpAccountScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class SetUpAccountScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableSetUpAccountScreen
  ): SetUpAccountScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    return new SetUpAccountScreenDelegate(
      this.eventBus,
      observableScreen,
      dialogDelegate,
      navigatorDelegate
    );
  }
}
