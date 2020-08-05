/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface CategoryFormStyles {
  container: ViewStyle;
  category_input_container: ViewStyle;
  category_input: TextStyle;
}

export class CategoryFormResponsiveStyles extends ResponsiveStyleSheet<
  CategoryFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): CategoryFormStyles {
    return {
      container: {
        flex: 1,
        paddingBottom: scaleByFactor(24),
      },

      category_input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      category_input: {
        flex: 1,
        height: scaleByFactor(44),
        fontSize: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<CategoryFormStyles> {
    return {
      category_input_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        borderTopColor: config.styles.light.primaryBorderColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      category_input: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<CategoryFormStyles> {
    return {
      category_input_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        borderTopColor: config.styles.dark.primaryBorderColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      category_input: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const categoryFormResponsiveStyles = new CategoryFormResponsiveStyles();
