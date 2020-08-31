/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface CategoryDetailHeaderStyles {
  container: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

export class CategoryDetailHeaderResponsiveStyles extends ResponsiveStyleSheet<
  CategoryDetailHeaderStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): CategoryDetailHeaderStyles {
    return {
      container: {
        paddingVertical: scaleByFactor(14),
        paddingHorizontal: scaleByFactor(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // Shrink the button if set name is too long
        flexShrink: 1,
      },

      button_text: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<CategoryDetailHeaderStyles> {
    return {
      container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      button_text: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<CategoryDetailHeaderStyles> {
    return {
      container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      button_text: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const categoryDetailHeaderResponsiveStyles = new CategoryDetailHeaderResponsiveStyles();
