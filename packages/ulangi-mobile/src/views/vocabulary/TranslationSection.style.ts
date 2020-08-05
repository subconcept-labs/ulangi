/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface TranslationSectionStyles {
  highlighted_text: TextStyle;
  bold: TextStyle;
}

export class TranslationSectionResponsiveStyles extends ResponsiveStyleSheet<
  TranslationSectionStyles
> {
  public baseStyles(): TranslationSectionStyles {
    return {
      highlighted_text: {
        color: config.styles.primaryColor,
      },

      bold: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<TranslationSectionStyles> {
    return {};
  }

  public darkStyles(): Partial<TranslationSectionStyles> {
    return {};
  }
}

export const translationSectionResponsiveStyles = new TranslationSectionResponsiveStyles();
