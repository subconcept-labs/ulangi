/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxMessageStyles {
  message_container: ViewStyle;
  message: TextStyle;
}

export class LightBoxMessageResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxMessageStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxMessageStyles {
    return {
      message_container: {
        alignSelf: 'stretch',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(11),
      },

      message: {
        lineHeight: scaleByFactor(19),
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<LightBoxMessageStyles> {
    return {
      message: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LightBoxMessageStyles> {
    return {
      message: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const lightBoxMessageResponsiveStyles = new LightBoxMessageResponsiveStyles();
