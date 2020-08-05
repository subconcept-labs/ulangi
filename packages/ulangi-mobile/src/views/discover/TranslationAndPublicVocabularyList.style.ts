/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface TranslationAndPublicVocabularyListStyles {
  list_container: ViewStyle;
  center_container: ViewStyle;
  message: TextStyle;
  button_container: ViewStyle;
  indicator: ViewStyle;
}

export class TranslationAndPublicVocabularyListResponsiveStyles extends ResponsiveStyleSheet<
  TranslationAndPublicVocabularyListStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): TranslationAndPublicVocabularyListStyles {
    return {
      list_container: {
        paddingBottom: scaleByFactor(74),
        paddingTop: scaleByFactor(8),
      },

      center_container: {
        flex: 1,
        paddingHorizontal: scaleByFactor(16),
        marginTop: scaleByFactor(8),
        justifyContent: 'center',
        alignItems: 'center',
      },

      message: {
        fontSize: scaleByFactor(15),
        textAlign: 'center',
        color: '#888',
      },

      button_container: {
        marginTop: scaleByFactor(8),
      },

      indicator: {
        marginTop: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<TranslationAndPublicVocabularyListStyles> {
    return {};
  }

  public darkStyles(): Partial<TranslationAndPublicVocabularyListStyles> {
    return {};
  }
}

export const translationAndPublicVocabularyListResponsiveStyles = new TranslationAndPublicVocabularyListResponsiveStyles();
