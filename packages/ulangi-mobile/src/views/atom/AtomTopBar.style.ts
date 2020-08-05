/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AtomTopBarStyles {
  container: ViewStyle;
  button: ViewStyle;
  score_container: ViewStyle;
  score_text: TextStyle;
}

export class AtomTopBarResponsiveStyles extends ResponsiveStyleSheet<
  AtomTopBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomTopBarStyles {
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
        fontSize: 20,
        color: '#efecca',
      },
    };
  }

  public lightStyles(): Partial<AtomTopBarStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomTopBarStyles> {
    return {};
  }
}

export const atomTopBarResponsiveStyles = new AtomTopBarResponsiveStyles();
