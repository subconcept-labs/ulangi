/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface HeatMapStyles {
  container: ViewStyle;
  item: ViewStyle;
  month_container: ViewStyle;
  month: TextStyle;
}

export interface HeatMapOptions {
  numOfColumns: number;
}

export class HeatMapResponsiveStyles extends ResponsiveStyleSheet<
  HeatMapStyles,
  HeatMapOptions
> {
  public baseStyles(scaleByFactor: ScaleByFactor): HeatMapStyles {
    return {
      container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },

      item: {
        height: scaleByFactor(24),
        width: scaleByFactor(24),
        borderRadius: scaleByFactor(2),
        margin: scaleByFactor(2),
      },

      month_container: {
        marginBottom: scaleByFactor(10),
      },

      month: {
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
        paddingVertical: scaleByFactor(4),
        paddingHorizontal: scaleByFactor(2),
      },
    };
  }

  public lightStyles(): Partial<HeatMapStyles> {
    return {
      month: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<HeatMapStyles> {
    return {
      month: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const heatMapResponsiveStyles = new HeatMapResponsiveStyles();
