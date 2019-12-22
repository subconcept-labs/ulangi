/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';

import { config } from '../constants/config';

export class SingleScreenStyle {
  public static SCREEN_BASE_STYLES_ONLY = {
    statusBar: {
      // Android only
      backgroundColor: config.styles.darkPrimaryColor,
    },
    topBar: {
      visible: true,
      noBorder: true,
      background: {
        color: config.styles.primaryColor,
      },
      title: {
        color: '#fff',
      },
      subtitle: {
        color: '#fff',
      },
      backButton: {
        visible: false,
      },
    },
    layout: {
      backgroundColor: config.styles.primaryColor,
    },
  };

  public static SCREEN_LIGHT_STYLES_ONLY = {};

  public static SCREEN_DARK_STYLES_ONLY = {};

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
        backgroundColor: config.styles.darkPrimaryColor,
      },
    },
  };
}
