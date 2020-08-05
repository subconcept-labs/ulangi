/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface QuizScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  middle_container: ViewStyle;
  title_container: ViewStyle;
  menu_container: ViewStyle;
  selected_categories_container: ViewStyle;
}

export class QuizScreenResponsiveStyles extends ResponsiveStyleSheet<
  QuizScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): QuizScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      container: {
        flex: 1,
      },

      middle_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

      title_container: {
        alignSelf: 'stretch',
        marginTop: -scaleByFactor(50),
      },

      menu_container: {
        alignSelf: 'stretch',
      },

      selected_categories_container: {
        marginTop: scaleByFactor(50),
      },
    };
  }

  public lightStyles(): Partial<QuizScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<QuizScreenStyles> {
    return {};
  }
}

export const quizScreenResponsiveStyles = new QuizScreenResponsiveStyles();
