/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableDarkModeScreen } from '@ulangi/ulangi-observable';

import { DarkModeScreenDelegate } from '../../delegates/dark-mode/DarkModeScreenDelegate';
import { DarkModeSelectionMenuDelegate } from '../../delegates/dark-mode/DarkModeSelectionMenuDelegate';
import { DarkModeSettingsDelegate } from '../../delegates/dark-mode/DarkModeSettingsDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class DarkModeScreenFactory extends ScreenFactory {
  public createDarkModeSettingsDelegate(): DarkModeSettingsDelegate {
    return new DarkModeSettingsDelegate(this.props.rootStore.userStore);
  }

  public createScreenDelegate(
    observableScreen: ObservableDarkModeScreen
  ): DarkModeScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const darkModeSelectionMenuDelegate = new DarkModeSelectionMenuDelegate(
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    return new DarkModeScreenDelegate(
      this.eventBus,
      observableScreen,
      darkModeSelectionMenuDelegate,
      dialogDelegate,
      navigatorDelegate
    );
  }
}
