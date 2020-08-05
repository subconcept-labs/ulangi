/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../../utils/responsive';

export interface MultipleChoiceSummaryStyles {
  stats_container: ViewStyle;
  result_container: ViewStyle;
  result_row: ViewStyle;
  percentage: TextStyle;
  grade: TextStyle;
  row: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  text_left: TextStyle;
  text_right: TextStyle;
  text_highlight: TextStyle;
  text_touchable: ViewStyle;
  horizontal_line: ViewStyle;
}

export class MultipleChoiceSummaryResponsiveStyles extends ResponsiveStyleSheet<
  MultipleChoiceSummaryStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): MultipleChoiceSummaryStyles {
    return {
      stats_container: {
        marginTop: scaleByFactor(12),
        marginBottom: scaleByFactor(12),
      },

      result_container: {
        marginHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
      },

      result_row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: scaleByFactor(2),
      },

      percentage: {
        fontWeight: 'bold',
      },

      grade: {
        fontWeight: 'bold',
      },

      row: {
        paddingHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
        paddingVertical: scaleByFactor(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      left: {
        flexShrink: 1,
        paddingRight: scaleByFactor(16),
      },

      right: {},

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
        marginHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
      },
    };
  }

  public lightStyles(): Partial<MultipleChoiceSummaryStyles> {
    return {
      percentage: {
        color: config.styles.light.secondaryTextColor,
      },

      grade: {
        color: config.styles.light.primaryTextColor,
      },

      text_left: {
        color: config.styles.light.secondaryTextColor,
      },

      text_right: {
        color: config.styles.light.primaryTextColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<MultipleChoiceSummaryStyles> {
    return {
      percentage: {
        color: config.styles.dark.secondaryTextColor,
      },

      grade: {
        color: config.styles.dark.primaryTextColor,
      },

      text_left: {
        color: config.styles.dark.secondaryTextColor,
      },

      text_right: {
        color: config.styles.dark.primaryTextColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const multipleChoiceSummaryResponsiveStyles = new MultipleChoiceSummaryResponsiveStyles();
