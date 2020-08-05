/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface FeatureRequestFormStyles {
  form: ViewStyle;
  text_container: ViewStyle;
  text: TextStyle;
  text_input_container: ViewStyle;
  text_input: TextStyle;
  bold: TextStyle;
}

export class FeatureRequestFormResponsiveStyles extends ResponsiveStyleSheet<
  FeatureRequestFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): FeatureRequestFormStyles {
    return {
      form: {
        flex: 1,
      },

      text_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
      },

      text: {
        lineHeight: scaleByFactor(19),
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
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      bold: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<FeatureRequestFormStyles> {
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

  public darkStyles(): Partial<FeatureRequestFormStyles> {
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

export const featureRequestFormResponsiveStyles = new FeatureRequestFormResponsiveStyles();
