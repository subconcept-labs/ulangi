/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import * as _ from 'lodash';

import { config } from '../constants/config';
import {
  darkStyles as touchableTitleDarkStyles,
  lightStyles as touchableTitleLightStyles,
} from '../views/common/TouchableTitle.style';

export class SecondaryScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = {
    topBar: {
      visible: true,
      noBorder: true,
    },
    bottomTabs: {
      visible: false,
      animate: true,
      drawBehind: true,
    },
  };

  public static SCREEN_LIGHT_STYLES_ONLY = {
    statusBar: {
      style: 'dark',
      backgroundColor: '#e0e0e0',
    },
    topBar: {
      background: {
        color: config.styles.light.secondaryBackgroundColor,
      },
      title: {
        color: config.styles.light.primaryTextColor,
      },
    },
    layout: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },
  };

  public static SCREEN_DARK_STYLES_ONLY = {
    statusBar: {
      style: 'light',
      backgroundColor: '#313131',
    },
    topBar: {
      background: {
        color: config.styles.dark.secondaryBackgroundColor,
      },
      title: {
        color: config.styles.dark.primaryTextColor,
      },
    },
    layout: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
    },
  };

  public static TOUCHABLE_TITLE_STYLES = {
    light: _.merge({}, touchableTitleLightStyles, {
      title: {
        color: '#888',
      },
      content_container: {
        backgroundColor: config.styles.light.secondaryBackgroundColor,
      },
    }),
    dark: _.merge({}, touchableTitleDarkStyles, {}),
  };

  public static LIGHT_BOX_SCREEN_STYLES: { light: Options; dark: Options } = {
    light: {
      statusBar: {
        style: 'dark',
        // Android only
        backgroundColor: '#e0e0e0',
      },
    },
    dark: {
      statusBar: {
        style: 'light',
        // Android only
        backgroundColor: '#212121',
      },
    },
  };
}
