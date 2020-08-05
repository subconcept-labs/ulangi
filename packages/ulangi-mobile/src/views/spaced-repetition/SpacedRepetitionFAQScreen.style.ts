/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface SpacedRepetitionFAQScreenStyles {
  screen: ViewStyle;
  highlighted: TextStyle;
}

export class SpacedRepetitionFAQScreenResponsiveStyles extends ResponsiveStyleSheet<
  SpacedRepetitionFAQScreenStyles
> {
  public baseStyles(): SpacedRepetitionFAQScreenStyles {
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

  public lightStyles(): Partial<SpacedRepetitionFAQScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<SpacedRepetitionFAQScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const spacedRepetitionFAQScreenResponsiveStyles = new SpacedRepetitionFAQScreenResponsiveStyles();
