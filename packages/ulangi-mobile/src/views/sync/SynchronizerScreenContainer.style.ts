/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { SynchronizerScreenIds } from '../../constants/ids/SynchronizerScreenIds';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class SynchronizerScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: SynchronizerScreenIds.TOP_BAR,
        title: {
          text: 'Synchronizer',
        },
      },
    }
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {
      topBar: {
        leftButtons: [
          {
            testID: SynchronizerScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_BLACK_22X22,
            id: SynchronizerScreenIds.BACK_BTN,
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
        leftButtons: [
          {
            testID: SynchronizerScreenIds.BACK_BTN,
            icon: Images.ARROW_LEFT_MILK_22X22,
            id: SynchronizerScreenIds.BACK_BTN,
            disableIconTint: true,
            color: config.styles.dark.primaryTextColor,
          },
        ],
      },
    }
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    SynchronizerScreenStyle.SCREEN_BASE_STYLES_ONLY,
    SynchronizerScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    SynchronizerScreenStyle.SCREEN_BASE_STYLES_ONLY,
    SynchronizerScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
