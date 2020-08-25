/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LevelNetChangeStyles {
  container: ViewStyle;
  text: TextStyle;
  text_green: TextStyle;
  text_red: TextStyle;
}

export class LevelNetChangeResponsiveStyles extends ResponsiveStyleSheet<
  LevelNetChangeStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LevelNetChangeStyles {
    return {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      text: {
        fontSize: scaleByFactor(15),
        color: '#666',
      },

      text_green: {
        color: '#3CB371',
      },

      text_red: {
        color: 'orangered',
      },
    };
  }

  public lightStyles(): Partial<LevelNetChangeStyles> {
    return {};
  }

  public darkStyles(): Partial<LevelNetChangeStyles> {
    return {};
  }
}

export const levelNetChangeResponsiveStyles = new LevelNetChangeResponsiveStyles();
