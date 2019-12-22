/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { WritingSettingsScreenIds } from '../../constants/ids/WritingSettingsScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';

export class WritingSettingsScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    LessonScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: WritingSettingsScreenIds.TOP_BAR,
        title: {
          text: 'Settings',
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
            testID: WritingSettingsScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: WritingSettingsScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
          },
        ],
        rightButtons: [
          {
            testID: WritingSettingsScreenIds.SAVE_BTN,
            id: WritingSettingsScreenIds.SAVE_BTN,
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
            testID: WritingSettingsScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: WritingSettingsScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
        rightButtons: [
          {
            testID: WritingSettingsScreenIds.SAVE_BTN,
            id: WritingSettingsScreenIds.SAVE_BTN,
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
    WritingSettingsScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingSettingsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    WritingSettingsScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WritingSettingsScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
