/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReflexTopBarStyles {
  container: ViewStyle;
  button: ViewStyle;
  score_container: ViewStyle;
  score_text: TextStyle;
}

export class ReflexTopBarResponsiveStyles extends ResponsiveStyleSheet<
  ReflexTopBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReflexTopBarStyles {
    return {
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scaleByFactor(16),
        paddingHorizontal: scaleByFactor(16),
      },

      button: {},

      score_container: {},

      score_text: {
        fontFamily: 'JosefinSans-bold',
        fontSize: scaleByFactor(20),
        color: '#efecca',
      },
    };
  }

  public lightStyles(): Partial<ReflexTopBarStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexTopBarStyles> {
    return {};
  }
}

export const reflexTopBarResponsiveStyles = new ReflexTopBarResponsiveStyles();
