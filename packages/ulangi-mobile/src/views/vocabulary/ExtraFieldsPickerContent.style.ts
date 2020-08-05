/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ExtraFieldsPickerContentStyles {
  picker_content: ViewStyle;
  row: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  description: TextStyle;
  name: TextStyle;
  btn_container: ViewStyle;
  btn: ViewStyle;
  btn_text: TextStyle;
  note: TextStyle;
}

export class ExtraFieldsPickerContentResponsiveStyles extends ResponsiveStyleSheet<
  ExtraFieldsPickerContentStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): ExtraFieldsPickerContentStyles {
    return {
      picker_content: {},

      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      left: {},

      right: {
        flexShrink: 1,
      },

      description: {},

      name: {
        fontSize: scaleByFactor(15),
        fontWeight: '700',
      },

      btn_container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },

      btn: {
        borderRadius: scaleByFactor(3),
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(8),
        paddingVertical: scaleByFactor(5),
        marginHorizontal: scaleByFactor(4),
        marginVertical: scaleByFactor(4),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.75,
        shadowOpacity: 0.15,
        elevation: 0.75,
      },

      btn_text: {
        fontSize: scaleByFactor(15),
      },

      note: {
        fontSize: scaleByFactor(12),
      },
    };
  }

  public lightStyles(): Partial<ExtraFieldsPickerContentStyles> {
    return {
      row: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      description: {
        color: config.styles.light.secondaryTextColor,
      },

      name: {
        color: config.styles.light.primaryTextColor,
      },

      btn: {
        borderColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      btn_text: {
        color: config.styles.light.primaryTextColor,
      },

      note: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ExtraFieldsPickerContentStyles> {
    return {
      row: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      description: {
        color: config.styles.dark.secondaryTextColor,
      },

      name: {
        color: config.styles.dark.primaryTextColor,
      },

      btn: {
        borderColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      btn_text: {
        color: config.styles.dark.primaryTextColor,
      },

      note: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const extraFieldsPickerContentResponsiveStyles = new ExtraFieldsPickerContentResponsiveStyles();
