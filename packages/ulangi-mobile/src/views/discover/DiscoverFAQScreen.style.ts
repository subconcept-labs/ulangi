/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface DiscoverFAQScreenStyles {
  screen: ViewStyle;
  highlighted: TextStyle;
}

export class DiscoverFAQScreenResponsiveStyles extends ResponsiveStyleSheet<
  DiscoverFAQScreenStyles
> {
  public baseStyles(): DiscoverFAQScreenStyles {
    return {
      screen: {
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<DiscoverFAQScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<DiscoverFAQScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const discoverFAQScreenResponsiveStyles = new DiscoverFAQScreenResponsiveStyles();
