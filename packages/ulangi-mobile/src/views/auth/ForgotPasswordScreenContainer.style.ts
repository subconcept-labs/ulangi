/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { SingleScreenStyle } from '../../styles/SingleScreenStyle';

export class ForgotPasswordScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SingleScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {}
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SingleScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {}
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    SingleScreenStyle.SCREEN_DARK_STYLES_ONLY,
    {}
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    ForgotPasswordScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ForgotPasswordScreenStyle.SCREEN_LIGHT_STYLES_ONLY
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    ForgotPasswordScreenStyle.SCREEN_BASE_STYLES_ONLY,
    ForgotPasswordScreenStyle.SCREEN_DARK_STYLES_ONLY
  );
}
