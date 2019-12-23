/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { CreateFirstSetScreenIds } from '../../constants/ids/CreateFirstSetScreenIds';
import { SingleScreenStyle } from '../../styles/SingleScreenStyle';

export class CreateFirstSetScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = _.merge(
    {},
    SingleScreenStyle.SCREEN_BASE_STYLES_ONLY,
    {
      topBar: {
        testID: CreateFirstSetScreenIds.TOP_BAR,
        visible: true,
        title: {
          text: '',
        },
        leftButtons: [
          {
            testID: CreateFirstSetScreenIds.LOG_OUT_BTN,
            icon: Images.ARROW_LEFT_WHITE_22X22,
            id: CreateFirstSetScreenIds.LOG_OUT_BTN,
            disableIconTint: true,
            color: '#fff',
          },
        ],
      },
    },
  );

  public static SCREEN_LIGHT_STYLES_ONLY = _.merge(
    {},
    SingleScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {},
  );

  public static SCREEN_DARK_STYLES_ONLY = _.merge(
    {},
    SingleScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
    {},
  );

  public static SCREEN_FULL_LIGHT_STYLES = _.merge(
    {},
    CreateFirstSetScreenStyle.SCREEN_BASE_STYLES_ONLY,
    CreateFirstSetScreenStyle.SCREEN_LIGHT_STYLES_ONLY,
  );

  public static SCREEN_FULL_DARK_STYLES = _.merge(
    {},
    CreateFirstSetScreenStyle.SCREEN_BASE_STYLES_ONLY,
    CreateFirstSetScreenStyle.SCREEN_DARK_STYLES_ONLY,
  );
}
