/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { CategorySelectorScreenIds } from '../../constants/ids/CategorySelectorScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class CategorySelectorScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: CategorySelectorScreenIds.TOP_BAR,
        title: {
          text: 'Select Category',
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
            testID: CategorySelectorScreenIds.DONE_BTN,
            text: 'Done',
            id: CategorySelectorScreenIds.DONE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: CategorySelectorScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: CategorySelectorScreenIds.BACK_BTN,
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
            testID: CategorySelectorScreenIds.DONE_BTN,
            text: 'Done',
            id: CategorySelectorScreenIds.DONE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: CategorySelectorScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: CategorySelectorScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    CategorySelectorScreenStyle.SCREEN_BASE_STYLES_ONLY,
    CategorySelectorScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    CategorySelectorScreenStyle.SCREEN_BASE_STYLES_ONLY,
    CategorySelectorScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
