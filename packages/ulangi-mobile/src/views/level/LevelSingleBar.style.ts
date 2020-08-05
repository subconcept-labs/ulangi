/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LevelSingleBarStyles {
  container: ViewStyle;
  part: ViewStyle;
}

export class LevelSingleBarResponsiveStyles extends ResponsiveStyleSheet<
  LevelSingleBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LevelSingleBarStyles {
    return {
      container: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
      },

      part: {
        height: scaleByFactor(10),
        borderRadius: scaleByFactor(5),
      },
    };
  }

  public lightStyles(): Partial<LevelSingleBarStyles> {
    return {};
  }

  public darkStyles(): Partial<LevelSingleBarStyles> {
    return {};
  }
}

export const levelSingleBarResponsiveStyles = new LevelSingleBarResponsiveStyles();
