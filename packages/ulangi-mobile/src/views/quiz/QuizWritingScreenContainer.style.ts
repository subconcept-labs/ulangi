/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { QuizWritingScreenIds } from '../../constants/ids/QuizWritingScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';

export class QuizWritingScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: QuizWritingScreenIds.TOP_BAR,
        title: {
          text: 'Writing',
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
            testID: QuizWritingScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: QuizWritingScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
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
            testID: QuizWritingScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: QuizWritingScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    }
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    QuizWritingScreenStyle.SCREEN_BASE_STYLES_ONLY,
    QuizWritingScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    QuizWritingScreenStyle.SCREEN_BASE_STYLES_ONLY,
    QuizWritingScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
