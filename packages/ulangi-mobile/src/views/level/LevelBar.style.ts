/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LevelBarStyles {
  container: ViewStyle;
  part: ViewStyle;
}

export class LevelBarResponsiveStyles extends ResponsiveStyleSheet<
  LevelBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LevelBarStyles {
    return {
      container: {
        flex: 1,
        flexDirection: 'row',
        height: scaleByFactor(10),
        borderRadius: scaleByFactor(5),
        overflow: 'hidden',
      },

      part: {},
    };
  }

  public lightStyles(): Partial<LevelBarStyles> {
    return {};
  }

  public darkStyles(): Partial<LevelBarStyles> {
    return {};
  }
}

export const levelBarResponsiveStyles = new LevelBarResponsiveStyles();
