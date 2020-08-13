/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableGoogleSheetsAddOnScreen } from '@ulangi/ulangi-observable';

import { GoogleSheetsAddOnScreenDelegate } from '../../delegates/google-sheets/GoogleSheetsAddOnScreenDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class GoogleSheetsAddOnScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableGoogleSheetsAddOnScreen,
  ): GoogleSheetsAddOnScreenDelegate {
    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const navigatorDelegate = this.createNavigatorDelegate();

    return new GoogleSheetsAddOnScreenDelegate(
      this.eventBus,
      observableScreen,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
