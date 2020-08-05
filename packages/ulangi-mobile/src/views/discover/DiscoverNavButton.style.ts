/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DiscoverNavButtonStyles {
  selected_text: TextStyle;
  text: TextStyle;
  count: TextStyle;
  selected_count: TextStyle;
  touchable: ViewStyle;
  selected_touchable: ViewStyle;
}

export class DiscoverNavButtonResponsiveStyles extends ResponsiveStyleSheet<
  DiscoverNavButtonStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DiscoverNavButtonStyles {
    return {
      selected_text: {},

      text: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(14),
      },

      count: {
        paddingLeft: scaleByFactor(5),
      },

      selected_count: {},

      touchable: {
        marginBottom: -StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(10),
        paddingTop: scaleByFactor(8),
        paddingBottom: scaleByFactor(10),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: scaleByFactor(8),
        flex: 1,
      },

      selected_touchable: {
        borderBottomColor: config.styles.primaryColor,
        borderBottomWidth: scaleByFactor(2),
      },
    };
  }

  public lightStyles(): Partial<DiscoverNavButtonStyles> {
    return {
      selected_text: {
        color: config.styles.light.primaryTextColor,
      },

      text: {
        color: config.styles.light.secondaryTextColor,
      },

      count: {
        color: config.styles.light.secondaryTextColor,
      },

      selected_count: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DiscoverNavButtonStyles> {
    return {
      selected_text: {
        color: config.styles.dark.primaryTextColor,
      },

      text: {
        color: config.styles.dark.secondaryTextColor,
      },

      count: {
        color: config.styles.dark.secondaryTextColor,
      },

      selected_count: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const discoverNavButtonResponsiveStyles = new DiscoverNavButtonResponsiveStyles();
