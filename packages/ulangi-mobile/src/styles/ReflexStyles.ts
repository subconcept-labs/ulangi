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
import { fullRoundedButtonStyles } from '../styles/FullRoundedButtonStyles';
import {
  Layout,
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../utils/responsive';

export class ReflexStyles {
  public getScreenStyle(options?: any): Options {
    return _.merge(
      {
        statusBar: {
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
          animate: false,
          drawBehind: true,
        },
        layout: {
          backgroundColor: config.reflex.backgroundColor,
        },
      },
      options,
    );
  }

  public getLightBoxScreenStyles(): { light: Options; dark: Options } {
    return {
      light: {
        statusBar: {
          style: 'light',
          backgroundColor: config.reflex.backgroundColor,
        },
      },
      dark: {
        statusBar: {
          style: 'light',
          backgroundColor: config.reflex.backgroundColor,
        },
      },
    };
  }
}

export class ReflexMenuButtonStyles extends ResponsiveStyleSheet<ButtonStyles> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
    layout: Layout,
  ): ButtonStyles {
    return _.merge(
      {},
      fullRoundedButtonStyles.baseStyles(
        scaleByFactor,
        scaleByBreakpoints,
        layout,
        {
          kind: 'solid',
          size: ButtonSize.LARGE,
          backgroundColor: config.reflex.backgroundColor,
          textColor: 'white',
        },
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

  public lightStyles(): Partial<ButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ButtonStyles> {
    return {};
  }
}

export const reflexStyles = new ReflexStyles();
export const reflexMenuButtonStyles = new ReflexMenuButtonStyles();
