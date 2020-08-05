/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ChangeEmailFormStyles {
  form: ViewStyle;
  text_input_container: ViewStyle;
  text_input: TextStyle;
  password_input: TextStyle;
  no_border: ViewStyle;
}

export class ChangeEmailFormResponsiveStyles extends ResponsiveStyleSheet<
  ChangeEmailFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ChangeEmailFormStyles {
    return {
      form: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      text_input_container: {
        paddingHorizontal: scaleByFactor(8),
      },

      text_input: {
        paddingHorizontal: scaleByFactor(8),
        paddingVertical: scaleByFactor(13),
        fontSize: scaleByFactor(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      password_input: {
        paddingHorizontal: scaleByFactor(8),
        paddingVertical: scaleByFactor(13),
        fontSize: scaleByFactor(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      no_border: {
        borderBottomWidth: 0,
      },
    };
  }

  public lightStyles(): Partial<ChangeEmailFormStyles> {
    return {
      form: {
        borderTopColor: config.styles.light.primaryBorderColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      text_input_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      text_input: {
        color: config.styles.light.primaryTextColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      password_input: {
        color: config.styles.light.primaryTextColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<ChangeEmailFormStyles> {
    return {
      form: {
        borderTopColor: config.styles.dark.primaryBorderColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      text_input_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      text_input: {
        color: config.styles.dark.primaryTextColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      password_input: {
        color: config.styles.dark.primaryTextColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const changeEmailFormResponsiveStyles = new ChangeEmailFormResponsiveStyles();
