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

export class PrimaryScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = {
    statusBar: {
      style: 'light',
    },
    topBar: {
      visible: true,
      animate: true,
      noBorder: true,
    },
    bottomTabs: {
      visible: true,
      animate: true,
    },
    bottomTab: {
      textColor: '#959595',
      selectedTextColor: config.styles.primaryColor,
    },
  };

  public static SCREEN_LIGHT_STYLES_ONLY = {
    statusBar: {
      backgroundColor: config.styles.darkPrimaryColor,
    },
    topBar: {
      background: {
        color: config.styles.primaryColor,
      },
    },
    layout: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },
  };

  public static SCREEN_DARK_STYLES_ONLY = {
    statusBar: {
      backgroundColor: '#000',
    },
    topBar: {
      background: {
        color: '#212121',
      },
    },
    layout: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
    },
  };

  public static TOP_BAR_LIGHT_STYLES = _.merge({}, defaultTopBarLightStyles, {
    title: {
      color: '#fff',
    },
    touchable: {
      backgroundColor: '#eee',
    },
    touchable_text: {
      color: '#888',
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
      color: '#777',
    },
  });

  public static LIGHT_BOX_SCREEN_STYLES: { light: Options; dark: Options } = {
    light: {
      statusBar: {
        style: 'light',
        // Android only
        backgroundColor: config.styles.darkPrimaryColor,
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
