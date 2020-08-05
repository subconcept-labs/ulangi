/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ShowAnswerButtonStyles {
  container: ViewStyle;
  show_answer_button_container: ViewStyle;
}

export class ShowAnswerButtonResponsiveStyles extends ResponsiveStyleSheet<
  ShowAnswerButtonStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ShowAnswerButtonStyles {
    return {
      container: {},

      show_answer_button_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
      },
    };
  }

  public lightStyles(): Partial<ShowAnswerButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<ShowAnswerButtonStyles> {
    return {};
  }
}

export const showAnswerButtonResponsiveStyles = new ShowAnswerButtonResponsiveStyles();
