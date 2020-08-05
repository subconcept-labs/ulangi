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
  darkStyles as defaultTopBarDarkStyles,
  lightStyles as defaultTopBarLightStyles,
} from '../views/top-bar/TopBar.style';

export class LessonScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = {
    topBar: {
      visible: true,
      noBorder: true,
    },
    bottomTabs: {
      visible: false,
      animate: false,
      drawBehind: true,
    },
  };

  public static SCREEN_LIGHT_STYLES_ONLY = {
    statusBar: {
      style: 'dark',
      backgroundColor: '#f3f3f3',
    },
    topBar: {
      background: {
        color: config.styles.light.primaryBackgroundColor,
      },
    },
    layout: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },
  };

  public static SCREEN_DARK_STYLES_ONLY = {
    statusBar: {
      style: 'light',
      backgroundColor: '#212121',
    },
    topBar: {
      background: {
        color: config.styles.dark.secondaryBackgroundColor,
      },
    },
    layout: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
    },
  };

  public static TOP_BAR_LIGHT_STYLES = _.merge({}, defaultTopBarLightStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },
    touchable: {
      backgroundColor: '#eee',
    },
    touchable_text: {
      color: config.styles.light.secondaryTextColor,
    },
  });

  public static TOP_BAR_DARK_STYLES = _.merge({}, defaultTopBarDarkStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },
    touchable: {
      backgroundColor: '#eee',
    },
    touchable_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  });

  public static LIGHT_BOX_SCREEN_STYLES: { light: Options; dark: Options } = {
    light: {
      statusBar: {
        style: 'dark',
        // Android only
        backgroundColor: '#f3f3f3',
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
