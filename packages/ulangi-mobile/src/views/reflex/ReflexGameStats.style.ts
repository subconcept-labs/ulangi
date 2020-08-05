/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReflexGameStatsStyles {
  container: ViewStyle;
  score_text: TextStyle;
}

export class ReflexGameStatsResponsiveStyles extends ResponsiveStyleSheet<
  ReflexGameStatsStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReflexGameStatsStyles {
    return {
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        flex: 1,
      },

      score_text: {
        fontFamily: 'Raleway-Black',
        fontSize: scaleByFactor(32),
        color: 'white',
      },
    };
  }

  public lightStyles(): Partial<ReflexGameStatsStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexGameStatsStyles> {
    return {};
  }
}

export const reflexGameStatsResponsiveStyles = new ReflexGameStatsResponsiveStyles();
