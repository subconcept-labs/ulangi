/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface CategoryItemStyles {
  item_container: ViewStyle;
  top_container: ViewStyle;
  bottom_container: ViewStyle;
  stats_container: ViewStyle;
  category_name: TextStyle;
  category_meta: TextStyle;
  left: ViewStyle;
  right: ViewStyle;
  right_item: ViewStyle;
  first_right_item: ViewStyle;
  action_btn: ViewStyle;
  count: TextStyle;
  terms: TextStyle;
  progress_container: ViewStyle;
  progress_text: TextStyle;
  review_btn: ViewStyle;
  count_container: ViewStyle;
  due_new_count: TextStyle;
  highlighted_count: TextStyle;
  not_applicable: TextStyle;
  caret: ImageStyle;
}

export class CategoryItemResponsiveStyles extends ResponsiveStyleSheet<
  CategoryItemStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): CategoryItemStyles {
    return {
      item_container: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        marginBottom: scaleByFactor(16),
        borderRadius: scaleByFactor(5),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.3 },
        shadowRadius: 0.75,
        shadowOpacity: 0.2,
      },

      top_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(14),
        paddingVertical: scaleByFactor(14),
      },

      bottom_container: {},

      stats_container: {
        paddingVertical: scaleByFactor(14),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      progress_container: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: scaleByFactor(14),
      },

      progress_text: {
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
        paddingBottom: scaleByFactor(4),
      },

      category_name: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(17),
        paddingBottom: scaleByFactor(4),
      },

      category_meta: {
        fontSize: scaleByFactor(12),
      },

      left: {
        paddingRight: scaleByFactor(12),
        flexShrink: 1,
      },

      right: {
        flexDirection: 'row',
        paddingLeft: scaleByFactor(12),
        alignItems: 'center',
        justifyContent: 'center',
      },

      right_item: {
        paddingLeft: scaleByFactor(14),
      },

      first_right_item: {
        paddingLeft: scaleByFactor(0),
      },

      action_btn: {},

      count: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(18),
        paddingBottom: scaleByFactor(3),
      },

      terms: {
        fontSize: scaleByFactor(12),
      },

      review_btn: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: scaleByFactor(12),
        width: scaleByFactor(100),
        paddingRight: scaleByFactor(10),
      },

      count_container: {
        flexShrink: 1,
      },

      due_new_count: {
        textAlign: 'right',
        fontSize: scaleByFactor(14),
      },

      not_applicable: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(14),
        paddingRight: scaleByFactor(2),
      },

      highlighted_count: {
        fontWeight: 'bold',
        color: '#66BB6A',
      },

      caret: {
        marginLeft: scaleByFactor(5),
        opacity: 0.7,
      },
    };
  }

  public lightStyles(): Partial<CategoryItemStyles> {
    return {
      item_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        elevation: 1,
      },

      bottom_container: {},

      stats_container: {
        borderTopColor: config.styles.light.secondaryBorderColor,
      },

      category_name: {
        color: config.styles.light.primaryTextColor,
      },

      category_meta: {
        color: config.styles.light.secondaryTextColor,
      },

      count: {
        color: config.styles.light.primaryTextColor,
      },

      terms: {
        color: config.styles.light.secondaryTextColor,
      },

      progress_text: {
        color: config.styles.light.secondaryTextColor,
      },

      due_new_count: {
        color: config.styles.light.secondaryTextColor,
      },

      not_applicable: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<CategoryItemStyles> {
    return {
      item_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        elevation: 3,
      },

      bottom_container: {},

      stats_container: {
        borderTopColor: config.styles.dark.secondaryBorderColor,
      },

      category_name: {
        color: config.styles.dark.primaryTextColor,
      },

      category_meta: {
        color: config.styles.dark.secondaryTextColor,
      },

      count: {
        color: config.styles.dark.primaryTextColor,
      },

      terms: {
        color: config.styles.dark.secondaryTextColor,
      },

      progress_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      due_new_count: {
        color: config.styles.dark.secondaryTextColor,
      },

      not_applicable: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }
}

export const categoryItemResponsiveStyles = new CategoryItemResponsiveStyles();
