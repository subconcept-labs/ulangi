/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface WritingSummaryStyles {
  stats_container: ViewStyle;
  result_container: ViewStyle;
  result_row: ViewStyle;
  row: ViewStyle;
  row_left: ViewStyle;
  row_right: ViewStyle;
  text_left: TextStyle;
  text_right: TextStyle;
  text_highlight: TextStyle;
  text_touchable: ViewStyle;
  horizontal_line: ViewStyle;
  percentage: TextStyle;
  grade: TextStyle;
}

export class WritingSummaryResponsiveStyles extends ResponsiveStyleSheet<
  WritingSummaryStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): WritingSummaryStyles {
    return {
      stats_container: {
        marginTop: scaleByFactor(12),
        marginBottom: scaleByFactor(12),
      },

      result_container: {
        marginHorizontal: scaleByFactor(16),
      },

      result_row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: scaleByFactor(2),
      },

      row: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      row_left: {
        flexShrink: 1,
        paddingRight: scaleByFactor(16),
      },

      row_right: {},

      text_left: {
        fontSize: scaleByFactor(14),
      },

      text_right: {
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
      },

      text_highlight: {
        color: config.styles.primaryColor,
      },

      text_touchable: {},

      horizontal_line: {
        height: 1,
        marginVertical: scaleByFactor(12),
        marginHorizontal: scaleByFactor(16),
      },

      percentage: {
        fontWeight: 'bold',
      },

      grade: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<WritingSummaryStyles> {
    return {
      text_left: {
        color: config.styles.light.secondaryTextColor,
      },

      text_right: {
        color: config.styles.light.primaryTextColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.light.primaryBorderColor,
      },

      percentage: {
        color: config.styles.light.secondaryTextColor,
      },

      grade: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<WritingSummaryStyles> {
    return {
      text_left: {
        color: config.styles.dark.secondaryTextColor,
      },

      text_right: {
        color: config.styles.dark.primaryTextColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.dark.primaryBorderColor,
      },

      percentage: {
        color: config.styles.dark.secondaryTextColor,
      },

      grade: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const writingSummaryResponsiveStyles = new WritingSummaryResponsiveStyles();
