/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { Platform } from 'react-native';

import { config } from '../constants/config';
import { FullRoundedButtonStyle } from '../styles/FullRoundedButtonStyle';

export class ReflexStyle {
  public static getScreenStyle(options?: any): Options {
    return _.merge(
      {
        statusBar: {
          visible: Platform.OS === 'android',
          style: 'light',
          backgroundColor: config.reflex.backgroundColor,
        },
        topBar: {
          visible: false,
          animate: true,
          noBorder: true,
          background: {
            color: config.reflex.backgroundColor,
          },
          // to hide on Android
          height: 0,
          backButton: {
            visible: false,
          },
        },
        bottomTabs: {
          visible: false,
          animate: true,
          drawBehind: true,
        },
        layout: {
          backgroundColor: config.reflex.backgroundColor,
        },
      },
      options,
    );
  }

  public static LIGHT_BOX_SCREEN_STYLES: { light: Options; dark: Options } = {
    light: {
      statusBar: {
        visible: Platform.OS === 'android',
        style: 'light',
        backgroundColor: config.reflex.backgroundColor,
      },
    },
    dark: {
      statusBar: {
        visible: Platform.OS === 'android',
        style: 'light',
        backgroundColor: config.reflex.backgroundColor,
      },
    },
  };

  public static getMenuButtonStyles(): ButtonStyles {
    return _.merge(
      FullRoundedButtonStyle.getFullBackgroundStyles(
        ButtonSize.LARGE,
        'white',
        config.reflex.backgroundColor,
      ),
      {
        buttonStyle: {
          paddingHorizontal: 40,
          marginTop: 16,
        },
        textStyle: {
          fontFamily: 'Raleway-Black',
        },
      },
    );
  }
}
