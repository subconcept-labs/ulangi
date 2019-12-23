/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { WritingLessonScreenIds } from '../../constants/ids/WritingLessonScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';

export class WritingLessonScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: WritingLessonScreenIds.TOP_BAR,
        title: {
          text: 'Writing',
        },
      },
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: WritingLessonScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: WritingLessonScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: WritingLessonScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: WritingLessonScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    WritingLessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingLessonScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    WritingLessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingLessonScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
