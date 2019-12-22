/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { WritingScreenIds } from '../../constants/ids/WritingScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';

export class WritingScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: WritingScreenIds.TOP_BAR,
        title: {
          text: '',
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
            testID: WritingScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: WritingScreenIds.BACK_BTN,
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
            testID: WritingScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: WritingScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    }
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    WritingScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    WritingScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
