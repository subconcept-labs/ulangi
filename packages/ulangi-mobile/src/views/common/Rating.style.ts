/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface RatingStyles {
  container: ViewStyle;
  icon_container: ViewStyle;
  icon: ImageStyle;
}

export class RatingResponsiveStyles extends ResponsiveStyleSheet<RatingStyles> {
  public baseStyles(scaleByFactor: ScaleByFactor): RatingStyles {
    return {
      container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      icon_container: {},

      icon: {
        marginHorizontal: scaleByFactor(3),
        marginBottom: 1,
      },
    };
  }

  public lightStyles(): Partial<RatingStyles> {
    return {};
  }

  public darkStyles(): Partial<RatingStyles> {
    return {};
  }
}

export const ratingResponsiveStyles = new RatingResponsiveStyles();
