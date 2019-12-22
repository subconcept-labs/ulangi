/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { AddSetScreenIds } from '../../constants/ids/AddSetScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class AddSetScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: AddSetScreenIds.TOP_BAR,
        title: {
          text: 'Add Set',
        },
      },
    }
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: AddSetScreenIds.SAVE_BTN,
            text: 'Save',
            id: AddSetScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: AddSetScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: AddSetScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryTextColor,
          },
        ],
      },
    }
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: AddSetScreenIds.SAVE_BTN,
            text: 'Save',
            id: AddSetScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.primaryColor,
          },
        ],
        leftButtons: [
          {
            testID: AddSetScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: AddSetScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    }
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    AddSetScreenStyle.SCREEN_BASE_STYLES_ONLY,
    AddSetScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    AddSetScreenStyle.SCREEN_BASE_STYLES_ONLY,
    AddSetScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
