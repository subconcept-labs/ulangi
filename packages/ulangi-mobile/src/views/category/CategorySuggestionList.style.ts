/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface CategorySuggestionListStyles {
  suggestion_list: ViewStyle;
  suggestion_title_container: ViewStyle;
  suggestion_title: TextStyle;
  show_all_suggestions_btn: ViewStyle;
  show_all_suggestions_text: TextStyle;
  suggestion_item: ViewStyle;
  empty_container: ViewStyle;
  empty_text: TextStyle;
  activity_indicator: ViewStyle;
  left: ViewStyle;
  category_name: TextStyle;
  category_meta: TextStyle;
  new_category: TextStyle;
}

export class CategorySuggestionListResponsiveStyles extends ResponsiveStyleSheet<
  CategorySuggestionListStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): CategorySuggestionListStyles {
    return {
      suggestion_list: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      suggestion_title_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(9),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      suggestion_title: {
        fontSize: scaleByFactor(12),
      },

      show_all_suggestions_btn: {},

      show_all_suggestions_text: {
        fontSize: scaleByFactor(15),
        color: config.styles.primaryColor,
      },

      suggestion_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      empty_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
      },

      empty_text: {
        fontSize: scaleByFactor(16),
      },

      activity_indicator: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      left: {},

      category_name: {
        fontSize: scaleByFactor(17),
        fontWeight: 'bold',
      },

      category_meta: {
        fontSize: scaleByFactor(14),
      },

      new_category: {
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<CategorySuggestionListStyles> {
    return {
      suggestion_list: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      suggestion_title_container: {
        backgroundColor: config.styles.light.secondaryBackgroundColor,
        borderBottomColor: config.styles.light.secondaryBorderColor,
      },

      suggestion_title: {
        color: config.styles.light.secondaryTextColor,
      },

      suggestion_item: {
        borderTopColor: config.styles.light.secondaryBorderColor,
      },

      empty_text: {
        color: config.styles.light.primaryTextColor,
      },

      category_name: {
        color: config.styles.light.primaryTextColor,
      },

      category_meta: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<CategorySuggestionListStyles> {
    return {
      suggestion_list: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      suggestion_title_container: {
        backgroundColor: config.styles.dark.secondaryBackgroundColor,
        borderBottomColor: config.styles.dark.secondaryBorderColor,
      },

      suggestion_title: {
        color: config.styles.dark.secondaryTextColor,
      },

      suggestion_item: {
        borderTopColor: config.styles.dark.secondaryBorderColor,
      },

      empty_text: {
        color: config.styles.dark.primaryTextColor,
      },

      category_name: {
        color: config.styles.dark.primaryTextColor,
      },

      category_meta: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const categorySuggestionListResponsiveStyles = new CategorySuggestionListResponsiveStyles();
