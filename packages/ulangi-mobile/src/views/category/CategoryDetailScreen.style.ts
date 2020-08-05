/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface CategoryDetailScreenStyles {
  screen: ViewStyle;
  floating_button_container: ViewStyle;
}

export class CategoryDetailScreenResponsiveStyles extends ResponsiveStyleSheet<
  CategoryDetailScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): CategoryDetailScreenStyles {
    return {
      screen: {
        flex: 1,
        borderTopWidth: 1,
      },

      floating_button_container: {
        position: 'absolute',
        right: scaleByFactor(14),
        bottom: scaleByFactor(14),
      },
    };
  }

  public lightStyles(): Partial<CategoryDetailScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<CategoryDetailScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const categoryDetailScreenResponsiveStyles = new CategoryDetailScreenResponsiveStyles();
