/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAutoArchiveScreen } from '@ulangi/ulangi-observable';

import { AutoArchiveScreenDelegate } from '../../delegates/auto-archive/AutoArchiveScreenDelegate';
import { AutoArchiveSettingsDelegate } from '../../delegates/auto-archive/AutoArchiveSettingsDelegate';
import { LevelSelectionMenuDelegate } from '../../delegates/vocabulary/LevelSelectionMenuDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class AutoArchiveScreenFactory extends ScreenFactory {
  public createAutoArchiveSettingsDelegate(): AutoArchiveSettingsDelegate {
    return new AutoArchiveSettingsDelegate(this.props.rootStore.userStore);
  }

  public createScreenDelegate(
    observableScreen: ObservableAutoArchiveScreen,
  ): AutoArchiveScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const levelSelectionMenuDelegate = new LevelSelectionMenuDelegate(
      navigatorDelegate,
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    return new AutoArchiveScreenDelegate(
      this.eventBus,
      observableScreen.autoArchiveSettings,
      levelSelectionMenuDelegate,
      dialogDelegate,
    );
  }
}
