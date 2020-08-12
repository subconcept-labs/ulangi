/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface QuizTitleStyles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  icon: ImageStyle;
}

export class QuizTitleResponsiveStyles extends ResponsiveStyleSheet<
  QuizTitleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): QuizTitleStyles {
    return {
      container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      title: {
        fontSize: scaleByFactor(26),
        fontFamily: 'JosefinSans-Bold',
        letterSpacing: -1,
      },

      subtitle: {
        fontSize: scaleByFactor(9),
        fontFamily: 'JosefinSans-Bold',
        letterSpacing: 0.5,
      },

      icon: {
        marginTop: scaleByFactor(10),
      },
    };
  }

  public lightStyles(): Partial<QuizTitleStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      subtitle: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<QuizTitleStyles> {
    return {
      title: {
        color: config.styles.dark.primaryTextColor,
      },

      subtitle: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const quizTitleResponsiveStyles = new QuizTitleResponsiveStyles();
