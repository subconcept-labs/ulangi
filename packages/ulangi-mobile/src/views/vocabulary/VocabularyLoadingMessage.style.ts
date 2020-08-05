/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyLoadingMessageStyles {
  loading_container: ViewStyle;
  loading_text: TextStyle;
}

export class VocabularyLoadingMessageResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyLoadingMessageStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): VocabularyLoadingMessageStyles {
    return {
      loading_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
      },

      loading_text: {
        fontSize: scaleByFactor(16),
        color: '#999',
      },
    };
  }

  public lightStyles(): Partial<VocabularyLoadingMessageStyles> {
    return {};
  }

  public darkStyles(): Partial<VocabularyLoadingMessageStyles> {
    return {};
  }
}

export const vocabularyLoadingMessageResponsiveStyles = new VocabularyLoadingMessageResponsiveStyles();
