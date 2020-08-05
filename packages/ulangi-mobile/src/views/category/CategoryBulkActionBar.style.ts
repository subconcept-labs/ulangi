/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface CategoryBulkActionBarStyles {
  container: ViewStyle;
  selection_text: TextStyle;
  number_of_selected: TextStyle;
  buttons: ViewStyle;
  button_container: ViewStyle;
}

export class CategoryBulkActionBarResponsiveStyles extends ResponsiveStyleSheet<
  CategoryBulkActionBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): CategoryBulkActionBarStyles {
    return {
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: config.styles.primaryColor,
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
      },

      selection_text: {
        flexShrink: 1,
        fontSize: scaleByFactor(15),
        color: 'white',
      },

      number_of_selected: {
        fontWeight: 'bold',
      },

      buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      button_container: {
        paddingLeft: scaleByFactor(12),
      },
    };
  }

  public lightStyles(): Partial<CategoryBulkActionBarStyles> {
    return {};
  }

  public darkStyles(): Partial<CategoryBulkActionBarStyles> {
    return {};
  }
}

export const categoryBulkActionBarResponsiveStyles = new CategoryBulkActionBarResponsiveStyles();
