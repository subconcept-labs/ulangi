/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SpacedRepetitionLessonScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
}

export class SpacedRepetitionLessonScreenResponsiveStyles extends ResponsiveStyleSheet<
  SpacedRepetitionLessonScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): SpacedRepetitionLessonScreenStyles {
    return {
      screen: {
        flex: 1,
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      container: {
        flexGrow: 1,
        paddingBottom: scaleByFactor(50),
      },
    };
  }

  public lightStyles(): Partial<SpacedRepetitionLessonScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<SpacedRepetitionLessonScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const spacedRepetitionLessonScreenResponsiveStyles = new SpacedRepetitionLessonScreenResponsiveStyles();
