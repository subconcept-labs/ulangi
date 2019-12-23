/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { FollowUsScreenIds } from '../../constants/ids/FollowUsScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class FollowUsScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: FollowUsScreenIds.TOP_BAR,
        title: {
          text: 'Follow Us',
        },
      },
    },
  );

  public static SCREEN_LIGHT_STYlES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: FollowUsScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: FollowUsScreenIds.BACK_BTN,
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
        leftButtons: [
          {
            testID: FollowUsScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: FollowUsScreenIds.BACK_BTN,
            disableIconTint: true,
            color: '#222',
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    FollowUsScreenStyle.SCREEN_BASE_STYLES_ONLY,
    FollowUsScreenStyle.SCREEN_LIGHT_STYlES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    FollowUsScreenStyle.SCREEN_BASE_STYLES_ONLY,
    FollowUsScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
