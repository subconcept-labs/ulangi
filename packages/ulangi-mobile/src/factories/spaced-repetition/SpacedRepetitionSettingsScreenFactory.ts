/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSpacedRepetitionSettingsScreen } from '@ulangi/ulangi-observable';

import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { SpacedRepetitionSettingsScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SpacedRepetitionSettingsScreenFactory extends ScreenFactory {
  public createSpacedRepetitionSettingsDelegate(): SpacedRepetitionSettingsDelegate {
    return new SpacedRepetitionSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableSpacedRepetitionSettingsScreen
  ): SpacedRepetitionSettingsScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const spacedRepetitionSettingsDelegate = this.createSpacedRepetitionSettingsDelegate();

    return new SpacedRepetitionSettingsScreenDelegate(
      observableScreen,
      spacedRepetitionSettingsDelegate,
      navigatorDelegate
    );
  }
}
