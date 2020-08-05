/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SetItemStyles {
  cell_container: ViewStyle;
  icon_container: ViewStyle;
  flag_icon: ImageStyle;
  content_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  set_name_container: ViewStyle;
  set_name: TextStyle;
  option_touchable: ViewStyle;
  meta_container: ViewStyle;
  meta_text: TextStyle;
  language: ViewStyle;
  dot: TextStyle;
  current_text: TextStyle;
}

export class SetItemResponsiveStyles extends ResponsiveStyleSheet<
  SetItemStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SetItemStyles {
    return {
      cell_container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
      },

      icon_container: {
        paddingRight: scaleByFactor(12),
      },

      flag_icon: {},

      content_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      left: {
        flexShrink: 1,
      },

      right: {},

      set_name_container: {
        paddingTop: scaleByFactor(14),
        paddingBottom: scaleByFactor(4),
      },

      set_name: {
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
      },

      option_touchable: {},

      meta_container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        paddingBottom: scaleByFactor(14),
      },

      meta_text: {
        fontSize: scaleByFactor(14),
      },

      language: {},

      dot: {
        fontSize: scaleByFactor(12),
        fontWeight: 'bold',
      },

      current_text: {
        paddingHorizontal: scaleByFactor(6),
        paddingVertical: scaleByFactor(2),
        color: 'coral',
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<SetItemStyles> {
    return {
      cell_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      set_name: {
        color: config.styles.light.primaryTextColor,
      },

      meta_text: {
        color: config.styles.light.secondaryTextColor,
      },

      dot: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<SetItemStyles> {
    return {
      cell_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      set_name: {
        color: config.styles.dark.primaryTextColor,
      },

      meta_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      dot: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const setItemResponsiveStyles = new SetItemResponsiveStyles();
