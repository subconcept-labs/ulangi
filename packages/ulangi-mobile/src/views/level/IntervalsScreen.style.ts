/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface IntervalsScreenStyles {
  screen: ViewStyle;
  row: ViewStyle;
  row_left: ViewStyle;
  row_right: ViewStyle;
  level: TextStyle;
  interval: TextStyle;
}

export class IntervalsScreenResponsiveStyles extends ResponsiveStyleSheet<
  IntervalsScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): IntervalsScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      row: {
        alignSelf: 'stretch',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(11),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      row_left: {
        flexShrink: 1,
        paddingRight: scaleByFactor(16),
      },

      row_right: {},

      level: {
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
      },

      interval: {
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<IntervalsScreenStyles> {
    return {
      row: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
      level: {
        color: config.styles.light.secondaryTextColor,
      },
      interval: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<IntervalsScreenStyles> {
    return {
      row: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
      level: {
        color: config.styles.dark.secondaryTextColor,
      },
      interval: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const intervalsScreenResponsiveStyles = new IntervalsScreenResponsiveStyles();
