/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { VocabularyDetailScreenIds } from '../../constants/ids/VocabularyDetailScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class VocabularyDetailScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: VocabularyDetailScreenIds.TOP_BAR,
        title: {
          text: 'Detail',
        },
      },
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: VocabularyDetailScreenIds.ACTION_BTN,
            icon: Images.HORIZONTAL_DOTS_BLACK_22X6,
            id: VocabularyDetailScreenIds.ACTION_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
          },
        ],
        leftButtons: [
          {
            testID: VocabularyDetailScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: VocabularyDetailScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: VocabularyDetailScreenIds.ACTION_BTN,
            icon: Images.HORIZONTAL_DOTS_MILK_22X6,
            id: VocabularyDetailScreenIds.ACTION_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
        leftButtons: [
          {
            testID: VocabularyDetailScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: VocabularyDetailScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    VocabularyDetailScreenStyle.SCREEN_BASE_STYLES_ONLY,
    VocabularyDetailScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    VocabularyDetailScreenStyle.SCREEN_BASE_STYLES_ONLY,
    VocabularyDetailScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
