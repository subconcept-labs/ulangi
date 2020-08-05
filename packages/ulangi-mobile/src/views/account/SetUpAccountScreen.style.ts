/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SetUpAccountScreenStyles {
  screen: ViewStyle;
  form: ViewStyle;
  text_input_container: ViewStyle;
  text_input: TextStyle;
  submit_btn_container: ViewStyle;
}

export class SetUpAccountScreenResponsiveStyles extends ResponsiveStyleSheet<
  SetUpAccountScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SetUpAccountScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      form: {
        flex: 1,
        marginTop: scaleByFactor(16),
        paddingHorizontal: scaleByFactor(16),
      },

      text_input_container: {
        marginVertical: scaleByFactor(5),
        borderRadius: scaleByFactor(5),
        borderWidth: StyleSheet.hairlineWidth,
      },

      text_input: {
        paddingHorizontal: scaleByFactor(12),
        paddingVertical: scaleByFactor(12),
        fontSize: scaleByFactor(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      submit_btn_container: {
        marginTop: scaleByFactor(8),
      },
    };
  }

  public lightStyles(): Partial<SetUpAccountScreenStyles> {
    return {
      text_input_container: {
        borderColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      text_input: {
        color: config.styles.light.primaryTextColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<SetUpAccountScreenStyles> {
    return {
      text_input_container: {
        borderColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      text_input: {
        color: config.styles.dark.primaryTextColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const setUpAccountScreenResponsiveStyles = new SetUpAccountScreenResponsiveStyles();
