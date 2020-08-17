/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface HeatMapDataPointScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  value: TextStyle;
}

export class HeatMapDataPointScreenResponsiveStyles extends ResponsiveStyleSheet<
  HeatMapDataPointScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): HeatMapDataPointScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      container: {
        paddingVertical: scaleByFactor(16),
        paddingHorizontal: scaleByFactor(16),
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      title: {
        fontSize: scaleByFactor(14),
        textAlign: 'center',
      },

      value: {
        fontSize: scaleByFactor(28),
        paddingTop: scaleByFactor(4),
        textAlign: 'center',
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<HeatMapDataPointScreenStyles> {
    return {
      container: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },

      title: {
        color: config.styles.light.secondaryTextColor,
      },

      value: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<HeatMapDataPointScreenStyles> {
    return {
      container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },

      title: {
        color: config.styles.dark.secondaryTextColor,
      },

      value: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const heatMapDataPointScreenResponsiveStyles = new HeatMapDataPointScreenResponsiveStyles();
