/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface QuizWritingScreenStyles {
  screen: ViewStyle;
}

export class QuizWritingScreenResponsiveStyles extends ResponsiveStyleSheet<
  QuizWritingScreenStyles
> {
  public baseStyles(): QuizWritingScreenStyles {
    return {
      screen: {
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
      },
    };
  }

  public lightStyles(): Partial<QuizWritingScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<QuizWritingScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const quizWritingScreenResponsiveStyles = new QuizWritingScreenResponsiveStyles();
