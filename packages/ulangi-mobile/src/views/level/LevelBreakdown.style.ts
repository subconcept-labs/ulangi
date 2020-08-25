/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LevelBreakdownStyles {
  container: ViewStyle;
  row_container: ViewStyle;
  level: TextStyle;
  count_container: ViewStyle;
  count: TextStyle;
  percentage: TextStyle;
}

export class LevelBreakdownResponsiveStyles extends ResponsiveStyleSheet<
  LevelBreakdownStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LevelBreakdownStyles {
    return {
      container: {},

      row_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(14),
      },

      level: {
        paddingRight: scaleByFactor(4),
        width: scaleByFactor(50),
        fontSize: scaleByFactor(14),
      },

      count_container: {
        width: scaleByFactor(50),
        paddingLeft: scaleByFactor(4),
      },

      count: {
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: scaleByFactor(14),
      },

      percentage: {
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: scaleByFactor(14),
      },
    };
  }

  public lightStyles(): Partial<LevelBreakdownStyles> {
    return {
      row_container: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },

      level: {
        color: config.styles.light.primaryTextColor,
      },

      count: {
        color: config.styles.light.primaryTextColor,
      },

      percentage: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LevelBreakdownStyles> {
    return {
      row_container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },

      level: {
        color: config.styles.dark.primaryTextColor,
      },

      count: {
        color: config.styles.dark.primaryTextColor,
      },

      percentage: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const levelBreakdownResponsiveStyles = new LevelBreakdownResponsiveStyles();
