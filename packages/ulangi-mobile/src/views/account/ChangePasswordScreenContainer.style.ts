/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { ChangePasswordScreenIds } from '../../constants/ids/ChangePasswordScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class ChangePasswordScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: ChangePasswordScreenIds.TOP_BAR,
        title: {
          text: 'Change Password',
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
            testID: ChangePasswordScreenIds.SAVE_BTN,
            text: 'Save',
            id: ChangePasswordScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.blueColor,
          },
        ],
        leftButtons: [
          {
            testID: ChangePasswordScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: ChangePasswordScreenIds.BACK_BTN,
            disableIconTint: true,
            color: '#222',
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
            testID: ChangePasswordScreenIds.SAVE_BTN,
            text: 'Save',
            id: ChangePasswordScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.blueColor,
          },
        ],
        leftButtons: [
          {
            testID: ChangePasswordScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: ChangePasswordScreenIds.BACK_BTN,
            disableIconTint: true,
            color: '#222',
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    ChangePasswordScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ChangePasswordScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    ChangePasswordScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ChangePasswordScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
