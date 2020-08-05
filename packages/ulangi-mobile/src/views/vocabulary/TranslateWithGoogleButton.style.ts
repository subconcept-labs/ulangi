/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface TranslateWithGoogleButtonStyles {
  translate_btn_container: ViewStyle;
  translate_btn: ViewStyle;
  translate_btn_text: TextStyle;
}

export class TranslateWithGoogleButtonResponsiveStyles extends ResponsiveStyleSheet<
  TranslateWithGoogleButtonStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): TranslateWithGoogleButtonStyles {
    return {
      translate_btn_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      translate_btn: {
        backgroundColor: '#ddd',
        height: scaleByFactor(34),
        borderRadius: scaleByFactor(17),
        justifyContent: 'center',
        alignItems: 'center',
        margin: scaleByFactor(16),
      },

      translate_btn_text: {
        paddingHorizontal: scaleByFactor(16),
        color: '#444',
        fontSize: scaleByFactor(12),
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<TranslateWithGoogleButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<TranslateWithGoogleButtonStyles> {
    return {};
  }
}

export const translateWithGoogleButtonResponsiveStyles = new TranslateWithGoogleButtonResponsiveStyles();
