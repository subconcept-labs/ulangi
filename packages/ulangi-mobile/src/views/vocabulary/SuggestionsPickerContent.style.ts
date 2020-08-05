/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SuggestionsPickerContentStyles {
  picker_content: ViewStyle;
  no_suggestions_text: TextStyle;
  highlighted_text: TextStyle;
  bold: TextStyle;
}

export class SuggestionsPickerContentResponsiveStyles extends ResponsiveStyleSheet<
  SuggestionsPickerContentStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): SuggestionsPickerContentStyles {
    return {
      picker_content: {},

      no_suggestions_text: {
        paddingVertical: scaleByFactor(10),
        textAlign: 'center',
        fontSize: scaleByFactor(14),
      },

      highlighted_text: {
        color: config.styles.primaryColor,
      },

      bold: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<SuggestionsPickerContentStyles> {
    return {
      no_suggestions_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SuggestionsPickerContentStyles> {
    return {
      no_suggestions_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const suggestionsPickerContentResponsiveStyles = new SuggestionsPickerContentResponsiveStyles();
