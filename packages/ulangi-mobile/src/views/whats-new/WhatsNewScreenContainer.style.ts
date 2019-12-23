/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { WhatsNewScreenIds } from '../../constants/ids/WhatsNewScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class WhatsNewScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: WhatsNewScreenIds.TOP_BAR,
        title: {
          text: "What's New",
        },
      },
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: WhatsNewScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: WhatsNewScreenIds.BACK_BTN,
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
        leftButtons: [
          {
            testID: WhatsNewScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: WhatsNewScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    },
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    WhatsNewScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WhatsNewScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    WhatsNewScreenStyle.SCREEN_BASE_STYLES_ONLY,
    WhatsNewScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
