/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SelectedCategoriesStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  category_name_list_container: ViewStyle;
  category_name: TextStyle;
}

export class SelectedCategoriesResponsiveStyles extends ResponsiveStyleSheet<
  SelectedCategoriesStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SelectedCategoriesStyles {
    return {
      container: {
        alignItems: 'center',
      },

      title_container: {},

      title: {
        fontSize: scaleByFactor(13),
        fontWeight: '700',
        //opacity: 0.4,
      },

      category_name_list_container: {
        flexDirection: 'row',
        marginHorizontal: scaleByFactor(50),
      },

      category_name: {
        paddingVertical: scaleByFactor(5),
        //opacity: 0.3,
        fontSize: scaleByFactor(14),
        fontWeight: '700',
      },
    };
  }

  public lightStyles(): Partial<SelectedCategoriesStyles> {
    return {
      title: {
        color: config.styles.light.secondaryTextColor,
      },

      category_name: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SelectedCategoriesStyles> {
    return {
      title: {
        color: config.styles.dark.secondaryTextColor,
      },

      category_name: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const selectedCategoriesResponsiveStyles = new SelectedCategoriesResponsiveStyles();
