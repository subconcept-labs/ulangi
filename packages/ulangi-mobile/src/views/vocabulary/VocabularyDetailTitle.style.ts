/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyDetailTitleStyles {
  container: ViewStyle;
  vocabulary_text: TextStyle;
}

export class VocabularyDetailTitleResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyDetailTitleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): VocabularyDetailTitleStyles {
    return {
      container: {
        paddingHorizontal: scaleByFactor(16),
        paddingTop: scaleByFactor(26),
        paddingBottom: scaleByFactor(8),
      },

      vocabulary_text: {
        fontSize: scaleByFactor(25),
        textAlign: 'center',
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<VocabularyDetailTitleStyles> {
    return {
      vocabulary_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<VocabularyDetailTitleStyles> {
    return {
      vocabulary_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const vocabularyDetailTitleResponsiveStyles = new VocabularyDetailTitleResponsiveStyles();
