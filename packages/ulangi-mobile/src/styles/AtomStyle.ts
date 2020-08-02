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

import { config } from '../constants/config';
import { ss } from '../utils/responsive';
import { FullRoundedButtonStyle } from './FullRoundedButtonStyle';

export class AtomStyle {
  public static getScreenStyle(options?: any): Options {
    return _.merge(
      {
        statusBar: {
          style: 'light',
          backgroundColor: config.atom.backgroundColor,
        },
        topBar: {
          visible: false,
          animate: true,
          noBorder: true,
          background: {
            color: config.atom.backgroundColor,
          },
          // to hide on Android
          height: 0,
          backButton: {
            visible: false,
          },
        },
        bottomTabs: {
          visible: false,
          animate: false,
          drawBehind: true,
        },
        layout: {
          backgroundColor: config.atom.backgroundColor,
        },
      },
      options,
    );
  }

  public static LIGHT_BOX_SCREEN_STYLES: { light: Options; dark: Options } = {
    light: {
      statusBar: {
        style: 'light',
        backgroundColor: config.atom.backgroundColor,
      },
    },
    dark: {
      statusBar: {
        style: 'light',
        backgroundColor: config.atom.backgroundColor,
      },
    },
  };

  public static getPrimaryMenuButtonStyles(): ButtonStyles {
    return _.merge(
      FullRoundedButtonStyle.getFullBackgroundStyles(
        ButtonSize.X_LARGE,
        config.atom.primaryColor,
        config.atom.textColor,
      ),
      {
        buttonStyle: {
          marginVertical: ss(9),
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 0.5 },
          shadowRadius: 0.8,
          shadowOpacity: 0.2,
        },
        textStyle: {
          fontFamily: 'JosefinSans-Bold',
          fontSize: ss(24),
          marginTop: ss(5),
        },
      },
    );
  }

  public static getSecondaryMenuButtonStyles(): ButtonStyles {
    return _.merge(
      FullRoundedButtonStyle.getFullBackgroundStyles(
        ButtonSize.LARGE,
        config.atom.secondaryColor,
        config.atom.textColor,
      ),
      {
        buttonStyle: {
          marginHorizontal: ss(16),
          marginVertical: ss(9),
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 0.5 },
          shadowRadius: 0.8,
          shadowOpacity: 0.2,
        },
        textStyle: {
          fontFamily: 'JosefinSans-Bold',
          fontSize: ss(20),
          marginTop: ss(5),
        },
      },
    );
  }

  public static getLightBoxPrimaryButtonStyles(): ButtonStyles {
    return AtomStyle.getLightBoxButtonStyles(config.atom.primaryColor, 'white');
  }

  public static getLightBoxSecondaryButtonStyles(): ButtonStyles {
    return AtomStyle.getLightBoxButtonStyles('#545454', 'white');
  }

  public static getLightBoxButtonStyles(
    backgroundColor: string,
    textColor: string,
  ): ButtonStyles {
    return _.merge(
      FullRoundedButtonStyle.getFullBackgroundStyles(
        ButtonSize.LARGE,
        backgroundColor,
        textColor,
      ),
      {
        buttonStyle: {
          flex: 1,
          marginHorizontal: ss(8),
        },
        textStyle: {
          fontFamily: 'JosefinSans-Bold',
        },
      },
    );
  }
}
