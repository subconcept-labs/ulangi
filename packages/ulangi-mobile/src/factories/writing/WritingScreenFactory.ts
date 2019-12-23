/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableWritingScreen } from '@ulangi/ulangi-observable';

import { CategoryMessageDelegate } from '../../delegates/category/CategoryMessageDelegate';
import { WritingScreenDelegate } from '../../delegates/writing/WritingScreenDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class WritingScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableWritingScreen,
  ): WritingScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const writingSettingsDelegate = new WritingSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );

    const categoryMessageDelegate = new CategoryMessageDelegate(dialogDelegate);

    return new WritingScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen,
      writingSettingsDelegate,
      navigatorDelegate,
      categoryMessageDelegate,
      this.props.analytics,
    );
  }
}
