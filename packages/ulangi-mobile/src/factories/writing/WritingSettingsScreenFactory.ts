/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { WritingSettingsDelegate } from '@ulangi/ulangi-delegate';
import { ObservableWritingSettingsScreen } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';
import { ReviewFeedbackButtonDelegate } from '../../delegates/review-feedback/ReviewFeedbackButtonDelegate';
import { WritingSettingsScreenDelegate } from '../../delegates/writing/WritingSettingsScreenDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class WritingSettingsScreenFactory extends ScreenFactory {
  public createWritingSettingsDelegate(): WritingSettingsDelegate {
    return new WritingSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      config.writing,
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableWritingSettingsScreen,
  ): WritingSettingsScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const writingSettingsDelegate = this.createWritingSettingsDelegate();

    const reviewFeedbackButtonDelegate = new ReviewFeedbackButtonDelegate();

    return new WritingSettingsScreenDelegate(
      observableScreen,
      writingSettingsDelegate,
      reviewFeedbackButtonDelegate,
      dialogDelegate,
      navigatorDelegate,
    );
  }
}
