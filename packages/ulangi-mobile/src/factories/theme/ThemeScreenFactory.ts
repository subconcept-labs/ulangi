/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableThemeScreen } from '@ulangi/ulangi-observable';

import { ThemeScreenDelegate } from '../../delegates/theme/ThemeScreenDelegate';
import { ThemeSelectionMenuDelegate } from '../../delegates/theme/ThemeSelectionMenuDelegate';
import { ThemeSettingsDelegate } from '../../delegates/theme/ThemeSettingsDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class ThemeScreenFactory extends ScreenFactory {
  public createThemeSettingsDelegate(): ThemeSettingsDelegate {
    return new ThemeSettingsDelegate(this.props.rootStore.userStore);
  }

  public createScreenDelegate(
    observableScreen: ObservableThemeScreen,
  ): ThemeScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const themeSelectionMenuDelegate = new ThemeSelectionMenuDelegate(
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new ThemeScreenDelegate(
      this.eventBus,
      observableScreen,
      themeSelectionMenuDelegate,
      dialogDelegate,
    );
  }
}
