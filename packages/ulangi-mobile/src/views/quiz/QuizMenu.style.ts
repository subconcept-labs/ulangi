/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface QuizMenuStyles {
  container: ViewStyle;
  primary_button_container: ViewStyle;
  secondary_button_container: ViewStyle;
}

export class QuizMenuResponsiveStyles extends ResponsiveStyleSheet<
  QuizMenuStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): QuizMenuStyles {
    return {
      container: {
        marginTop: scaleByFactor(42),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },
      primary_button_container: {
        marginHorizontal: scaleByFactor(5),
        marginVertical: scaleByFactor(6),
      },
      secondary_button_container: {
        marginHorizontal: scaleByFactor(22),
        marginVertical: scaleByFactor(6),
      },
    };
  }

  public lightStyles(): Partial<QuizMenuStyles> {
    return {};
  }

  public darkStyles(): Partial<QuizMenuStyles> {
    return {};
  }
}

export const quizMenuResponsiveStyles = new QuizMenuResponsiveStyles();
