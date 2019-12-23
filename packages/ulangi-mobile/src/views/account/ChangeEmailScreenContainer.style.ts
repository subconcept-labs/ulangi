/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { ChangeEmailScreenIds } from '../../constants/ids/ChangeEmailScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class ChangeEmailScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: ChangeEmailScreenIds.TOP_BAR,
        title: {
          text: 'Change Email',
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
            testID: ChangeEmailScreenIds.SAVE_BTN,
            text: 'Save',
            id: ChangeEmailScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.blueColor,
          },
        ],
        leftButtons: [
          {
            testID: ChangeEmailScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: ChangeEmailScreenIds.BACK_BTN,
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
            testID: ChangeEmailScreenIds.SAVE_BTN,
            text: 'Save',
            id: ChangeEmailScreenIds.SAVE_BTN,
            disableIconTint: true,
            color: config.styles.blueColor,
          },
        ],
        leftButtons: [
          {
            testID: ChangeEmailScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: ChangeEmailScreenIds.BACK_BTN,
            disableIconTint: true,
            color: '#222',
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    ChangeEmailScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ChangeEmailScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    ChangeEmailScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ChangeEmailScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
