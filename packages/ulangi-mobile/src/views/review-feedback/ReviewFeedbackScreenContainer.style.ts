/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { ReviewFeedbackScreenIds } from '../../constants/ids/ReviewFeedbackScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';

export class ReviewFeedbackScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: ReviewFeedbackScreenIds.TOP_BAR,
        title: {
          text: 'Review Feedback',
        },
      },
    }
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: ReviewFeedbackScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: ReviewFeedbackScreenIds.BACK_BTN,
            disableIconTint: true,
            color: '#222',
          },
        ],
        rightButtons: [
          {
            testID: ReviewFeedbackScreenIds.SAVE_BTN,
            id: ReviewFeedbackScreenIds.SAVE_BTN,
            text: 'Save',
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
      },
    }
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: ReviewFeedbackScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: ReviewFeedbackScreenIds.BACK_BTN,
            disableIconTint: true,
            color: '#222',
          },
        ],
        rightButtons: [
          {
            testID: ReviewFeedbackScreenIds.SAVE_BTN,
            id: ReviewFeedbackScreenIds.SAVE_BTN,
            text: 'Save',
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
      },
    }
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    ReviewFeedbackScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ReviewFeedbackScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    ReviewFeedbackScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ReviewFeedbackScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
