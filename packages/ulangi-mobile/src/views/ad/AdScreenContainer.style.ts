/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';

export class AdScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        title: {
          text: '',
        },
      },
      popGesture: false,
    }
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    SecondaryScreenStyle.SCREEN_DARK_STYLES_ONLY
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    AdScreenStyle.SCREEN_BASE_STYLES_ONLY,
    AdScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    AdScreenStyle.SCREEN_BASE_STYLES_ONLY,
    AdScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
