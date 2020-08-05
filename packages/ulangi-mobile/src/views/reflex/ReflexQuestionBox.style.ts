/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReflexQuestionBoxStyles {
  container: ViewStyle;
  question_container: ViewStyle;
  question: TextStyle;
  time_bar_container: ViewStyle;
  time_bar_placeholder: ViewStyle;
  time_bar: ViewStyle;
  yes: TextStyle;
  no: TextStyle;
  vocabulary: TextStyle;
  meaning: TextStyle;
}

export class ReflexQuestionBoxResponsiveStyles extends ResponsiveStyleSheet<
  ReflexQuestionBoxStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReflexQuestionBoxStyles {
    return {
      container: {
        marginHorizontal: scaleByFactor(16),
        marginVertical: scaleByFactor(10),
        borderRadius: scaleByFactor(4),
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
      },

      question_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
      },

      question: {
        textAlign: 'center',
        color: '#555',
        fontSize: scaleByFactor(17),
        lineHeight: scaleByFactor(22),
      },

      time_bar_container: {
        paddingHorizontal: scaleByFactor(10),
        paddingVertical: scaleByFactor(8),
        backgroundColor: '#e6e6e6',
      },

      time_bar_placeholder: {
        height: scaleByFactor(8),
        backgroundColor: '#ccc',
        borderRadius: scaleByFactor(8) / 2,
        overflow: 'hidden',
      },

      time_bar: {
        height: scaleByFactor(8),
        backgroundColor: 'darkturquoise',
      },

      yes: {
        color: '#2fc68f',
        fontWeight: 'bold',
      },

      no: {
        color: '#ff7396',
        fontWeight: 'bold',
      },

      vocabulary: {
        fontWeight: 'bold',
        color: config.reflex.backgroundColor,
      },

      meaning: {
        color: '#555',
      },
    };
  }

  public lightStyles(): Partial<ReflexQuestionBoxStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexQuestionBoxStyles> {
    return {};
  }
}

export const reflexQuestionBoxResponsiveStyles = new ReflexQuestionBoxResponsiveStyles();
