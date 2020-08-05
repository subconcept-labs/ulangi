/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LanguagePickerStyles {
  picker_container: ViewStyle;
  top_bar_container: ViewStyle;
  top_bar_text_container: ViewStyle;
  top_bar_text: TextStyle;
  close_button: ViewStyle;
  close_text: TextStyle;
  list_container: ViewStyle;
}

export class LanguagePickerResponsiveStyles extends ResponsiveStyleSheet<
  LanguagePickerStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LanguagePickerStyles {
    return {
      picker_container: {
        flex: 1,
        marginTop: scaleByFactor(15),
      },

      top_bar_container: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      top_bar_text_container: {
        borderBottomWidth: 2,
        height: scaleByFactor(44),
        justifyContent: 'center',
        marginBottom: -1,
      },

      top_bar_text: {
        paddingHorizontal: scaleByFactor(16),
        fontWeight: 'bold',
        fontSize: scaleByFactor(16),
      },

      close_button: {
        height: scaleByFactor(44),
        justifyContent: 'center',
        marginBottom: -1,
      },

      close_text: {
        paddingHorizontal: scaleByFactor(16),
        color: config.styles.primaryColor,
        fontSize: scaleByFactor(16),
      },

      list_container: {
        flex: 1,
      },
    };
  }

  public lightStyles(): Partial<LanguagePickerStyles> {
    return {
      picker_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      top_bar_container: {
        borderBottomColor: config.styles.light.secondaryBackgroundColor,
        backgroundColor: config.styles.light.secondaryBackgroundColor,
      },

      top_bar_text_container: {
        borderBottomColor: '#000000',
      },

      top_bar_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LanguagePickerStyles> {
    return {
      picker_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      top_bar_container: {
        borderBottomColor: config.styles.dark.secondaryBackgroundColor,
        backgroundColor: config.styles.dark.secondaryBackgroundColor,
      },

      top_bar_text_container: {
        borderBottomColor: config.styles.primaryColor,
      },

      top_bar_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const languagePickerResponsiveStyles = new LanguagePickerResponsiveStyles();
