/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface NoVocabularyStyles {
  scroll_view_container: ViewStyle;
  animation_container: ViewStyle;
  no_vocabulary_text: TextStyle;
}

export class NoVocabularyResponsiveStyles extends ResponsiveStyleSheet<
  NoVocabularyStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): NoVocabularyStyles {
    return {
      scroll_view_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
      },

      animation_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      no_vocabulary_text: {
        textAlign: 'center',
        fontSize: scaleByFactor(15),
        color: '#999',
        lineHeight: scaleByFactor(19),
      },
    };
  }

  public lightStyles(): Partial<NoVocabularyStyles> {
    return {};
  }

  public darkStyles(): Partial<NoVocabularyStyles> {
    return {};
  }
}

export const noVocabularyResponsiveStyles = new NoVocabularyResponsiveStyles();
