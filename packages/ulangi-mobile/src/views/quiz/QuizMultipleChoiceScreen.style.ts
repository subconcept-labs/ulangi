/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface QuizMultipleChoiceScreenStyles {
  screen: ViewStyle;
}

export class QuizMultipleChoiceScreenResponsiveStyles extends ResponsiveStyleSheet<
  QuizMultipleChoiceScreenStyles
> {
  public baseStyles(): QuizMultipleChoiceScreenStyles {
    return {
      screen: {
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
      },
    };
  }

  public lightStyles(): Partial<QuizMultipleChoiceScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<QuizMultipleChoiceScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const quizMultipleChoiceScreenResponsiveStyles = new QuizMultipleChoiceScreenResponsiveStyles();
