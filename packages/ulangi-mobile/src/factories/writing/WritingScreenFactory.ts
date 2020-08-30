/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { WritingSettingsDelegate } from '@ulangi/ulangi-delegate';
import { ObservableWritingScreen } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';
import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { WritingCountsDelegate } from '../../delegates/writing/WritingCountsDelegate';
import { WritingScreenDelegate } from '../../delegates/writing/WritingScreenDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class WritingScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegateWithStyles(): SetSelectionMenuDelegate {
    return this.createSetSelectionMenuDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

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
      config.writing,
    );

    const writingCountsDelegate = new WritingCountsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      writingSettingsDelegate,
    );

    return new WritingScreenDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen,
      writingSettingsDelegate,
      writingCountsDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
