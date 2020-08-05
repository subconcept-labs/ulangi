/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface VocabularyDetailScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
}

export class VocabularyDetailScreenResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyDetailScreenStyles
> {
  public baseStyles(): VocabularyDetailScreenStyles {
    return {
      screen: {
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      container: {
        flex: 1,
      },
    };
  }

  public lightStyles(): Partial<VocabularyDetailScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<VocabularyDetailScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const vocabularyDetailScreenResponsiveStyles = new VocabularyDetailScreenResponsiveStyles();
