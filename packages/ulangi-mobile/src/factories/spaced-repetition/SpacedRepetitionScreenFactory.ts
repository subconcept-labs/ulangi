/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSpacedRepetitionScreen } from '@ulangi/ulangi-observable';

import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { SpacedRepetitionCountsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionCountsDelegate';
import { SpacedRepetitionScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionScreenDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class SpacedRepetitionScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegateWithStyles(): SetSelectionMenuDelegate {
    return this.createSetSelectionMenuDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableSpacedRepetitionScreen,
  ): SpacedRepetitionScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const spacedRepetitionSettingsDelegate = new SpacedRepetitionSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const spacedRepetitionCountsDelegate = new SpacedRepetitionCountsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      spacedRepetitionSettingsDelegate,
    );

    return new SpacedRepetitionScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen,
      spacedRepetitionSettingsDelegate,
      spacedRepetitionCountsDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
