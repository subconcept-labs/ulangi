/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SetFormStyles {
  form_body_container: ViewStyle;
  set_name_container: ViewStyle;
  set_name_input: TextStyle;
  button_container: ViewStyle;
  button_touchable: ViewStyle;
  button_disabled: ViewStyle;
  button_text: TextStyle;
  button_text_disabled: TextStyle;
  bold: TextStyle;
}

export class SetFormResponsiveStyles extends ResponsiveStyleSheet<
  SetFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SetFormStyles {
    return {
      form_body_container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      set_name_container: {
        paddingHorizontal: scaleByFactor(8),
      },

      set_name_input: {
        paddingVertical: scaleByFactor(12),
        fontSize: scaleByFactor(16),
        textAlign: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      button_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(6),
      },

      button_touchable: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: scaleByFactor(3),
        paddingVertical: scaleByFactor(10),
        paddingHorizontal: scaleByFactor(12),
        marginVertical: scaleByFactor(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      button_disabled: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: scaleByFactor(3),
      },

      button_text: {
        fontSize: scaleByFactor(15),
      },

      button_text_disabled: {},

      bold: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<SetFormStyles> {
    return {
      form_body_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        borderTopColor: config.styles.light.primaryBorderColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      set_name_input: {
        color: config.styles.light.primaryTextColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      button_touchable: {
        backgroundColor: config.styles.light.secondaryBackgroundColor,
        borderColor: config.styles.light.primaryBorderColor,
      },

      button_disabled: {
        backgroundColor: '#eee',
      },

      button_text: {
        color: config.styles.light.primaryTextColor,
      },

      button_text_disabled: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SetFormStyles> {
    return {
      form_body_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        borderTopColor: config.styles.dark.primaryBorderColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      set_name_input: {
        color: config.styles.dark.primaryTextColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      button_touchable: {
        backgroundColor: config.styles.dark.secondaryBackgroundColor,
        borderColor: config.styles.dark.primaryBorderColor,
      },

      button_disabled: {
        backgroundColor: '#222',
      },

      button_text: {
        color: config.styles.dark.primaryTextColor,
      },

      button_text_disabled: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const setFormResponsiveStyles = new SetFormResponsiveStyles();
