/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSpacedRepetitionScreen } from '@ulangi/ulangi-observable';

import { CategoryMessageDelegate } from '../../delegates/category/CategoryMessageDelegate';
import { LinkingDelegate } from '../../delegates/linking/LinkingDelegate';
import { SpacedRepetitionScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionScreenDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class SpacedRepetitionScreenFactory extends ScreenFactory {
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

    const categoryMessageDelegate = new CategoryMessageDelegate(dialogDelegate);

    const linkingDelegate = new LinkingDelegate(dialogDelegate);

    return new SpacedRepetitionScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen,
      spacedRepetitionSettingsDelegate,
      navigatorDelegate,
      categoryMessageDelegate,
      linkingDelegate,
      this.props.analytics,
    );
  }
}
