/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyDetailStrokeOrderStyles {
  container: ViewStyle;
  button_text: TextStyle;
}

export class VocabularyDetailStrokeOrderResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyDetailStrokeOrderStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): VocabularyDetailStrokeOrderStyles {
    return {
      container: {},

      button_text: {
        fontSize: scaleByFactor(15),
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<VocabularyDetailStrokeOrderStyles> {
    return {
      container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },
    };
  }

  public darkStyles(): Partial<VocabularyDetailStrokeOrderStyles> {
    return {};
  }
}

export const vocabularyDetailStrokeOrderResponsiveStyles = new VocabularyDetailStrokeOrderResponsiveStyles();
