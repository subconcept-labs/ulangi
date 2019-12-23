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
import { SearchScreenIds } from '../../constants/ids/SearchScreenIds';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { touchableTitle } from '../common/TouchableTitle';

export class SearchScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    PrimaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: SearchScreenIds.TOP_BAR,
        title: touchableTitle(ScreenName.SEARCH_SCREEN),
      },
      bottomTabs: {
        animate: true,
        visible: false,
        drawBehind: true,
      },
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    PrimaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: SearchScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_WHITE_22X22,
            id: SearchScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.light.primaryBackgroundColor,
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
        leftButtons: [
          {
            testID: SearchScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: SearchScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    SearchScreenStyle.SCREEN_BASE_STYLES_ONLY,
    SearchScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    SearchScreenStyle.SCREEN_BASE_STYLES_ONLY,
    SearchScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
