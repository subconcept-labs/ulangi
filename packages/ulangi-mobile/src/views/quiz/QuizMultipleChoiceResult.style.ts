/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface QuizMultipleChoiceResultStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  table: ViewStyle;
  row: ViewStyle;
  horizontal_line: TextStyle;
  bold: TextStyle;
  button_containers: ViewStyle;
  button_container: ViewStyle;
}

export class QuizMultipleChoiceResultResponsiveStyles extends ResponsiveStyleSheet<
  QuizMultipleChoiceResultStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): QuizMultipleChoiceResultStyles {
    return {
      container: {
        flex: 1,
      },

      title_container: {
        marginTop: scaleByFactor(30),
        alignItems: 'center',
        justifyContent: 'center',
      },

      title: {
        fontSize: scaleByFactor(16),
        fontWeight: 'bold',
      },

      table: {
        marginTop: scaleByFactor(20),
        paddingHorizontal: scaleByFactor(16),
      },

      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scaleByFactor(4),
      },

      horizontal_line: {
        height: 1,
        marginVertical: scaleByFactor(12),
      },

      bold: {
        fontWeight: 'bold',
      },

      button_containers: {
        marginTop: scaleByFactor(8),
      },

      button_container: {
        marginVertical: scaleByFactor(6),
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },
    };
  }

  public lightStyles(): Partial<QuizMultipleChoiceResultStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<QuizMultipleChoiceResultStyles> {
    return {
      title: {
        color: config.styles.dark.primaryTextColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const quizMultipleChoiceResultResponsiveStyles = new QuizMultipleChoiceResultResponsiveStyles();
