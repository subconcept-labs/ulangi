/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReportAnErrorFormStyles {
  form: ViewStyle;
  text_container: ViewStyle;
  text: TextStyle;
  bold: TextStyle;
  text_input_container: ViewStyle;
  text_input: TextStyle;
}

export class ReportAnErrorFormResponsiveStyles extends ResponsiveStyleSheet<
  ReportAnErrorFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReportAnErrorFormStyles {
    return {
      form: {
        flex: 1,
      },

      text_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(10),
      },

      text: {
        paddingVertical: scaleByFactor(2),
        color: '#333',
        lineHeight: scaleByFactor(19),
      },

      bold: {
        fontWeight: 'bold',
      },

      text_input_container: {
        flex: 1,
      },

      text_input: {
        flex: 1,
        textAlignVertical: 'top',
        paddingHorizontal: scaleByFactor(16),
        paddingTop: scaleByFactor(10),
        paddingBottom: scaleByFactor(10),
        backgroundColor: '#fff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#cecece',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cecece',
      },
    };
  }

  public lightStyles(): Partial<ReportAnErrorFormStyles> {
    return {
      text: {
        color: config.styles.light.primaryTextColor,
      },

      text_input: {
        color: config.styles.light.primaryTextColor,
        backgroundColor: config.styles.light.primaryBackgroundColor,
        borderTopColor: config.styles.light.primaryBorderColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<ReportAnErrorFormStyles> {
    return {
      text: {
        color: config.styles.dark.primaryTextColor,
      },

      text_input: {
        color: config.styles.dark.primaryTextColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        borderTopColor: config.styles.dark.primaryBorderColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const reportAnErrorFormResponsiveStyles = new ReportAnErrorFormResponsiveStyles();
