/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { ManageScreenIds } from '../../constants/ids/ManageScreenIds';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { touchableTitle } from '../../views/common/TouchableTitle';

export class ManageScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    PrimaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: ManageScreenIds.TOP_BAR,
        title: touchableTitle(ScreenName.MANAGE_SCREEN),
      },
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    PrimaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: ManageScreenIds.QUICK_TUTORIAL_BTN,
            icon: Images.INFO_WHITE_22X22,
            id: ManageScreenIds.QUICK_TUTORIAL_BTN,
            color: config.styles.light.primaryBackgroundColor,
            disableIconTint: true,
          },
        ],
        leftButtons: [
          {
            testID: ManageScreenIds.SEARCH_BTN,
            icon: Images.SEARCH_WHITE_20X20,
            id: ManageScreenIds.SEARCH_BTN,
            color: config.styles.light.primaryBackgroundColor,
            disableIconTint: true,
          },
        ],
      },
    },
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    PrimaryScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {
      topBar: {
        rightButtons: [
          {
            testID: ManageScreenIds.QUICK_TUTORIAL_BTN,
            icon: Images.INFO_MILK_22X22,
            id: ManageScreenIds.QUICK_TUTORIAL_BTN,
            color: config.styles.dark.primaryTextColor,
            disableIconTint: true,
          },
        ],
        leftButtons: [
          {
            testID: ManageScreenIds.SEARCH_BTN,
            icon: Images.SEARCH_MILK_20X20,
            id: ManageScreenIds.SEARCH_BTN,
            color: config.styles.dark.primaryTextColor,
            disableIconTint: true,
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    ManageScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ManageScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    ManageScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ManageScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
