/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface HeatMapScreenStyles {
  screen: ViewStyle;
  top_bar: ViewStyle;
  top_bar_button: TextStyle;
  top_bar_button_text: TextStyle;
  year: TextStyle;
  heat_map_container: ViewStyle;
  spinner: ViewStyle;
  error_message: TextStyle;
  highlighted: TextStyle;
}

export class HeatMapScreenResponsiveStyles extends ResponsiveStyleSheet<
  HeatMapScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): HeatMapScreenStyles {
    return {
      screen: {
        flex: 1,
        borderTopWidth: 1,
      },

      top_bar: {
        paddingVertical: scaleByFactor(14),
        paddingHorizontal: scaleByFactor(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
      },

      top_bar_button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1,
      },

      top_bar_button_text: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(15),
      },

      year: {
        fontSize: scaleByFactor(32),
        paddingVertical: scaleByFactor(30),
        textAlign: 'center',
        fontWeight: 'bold',
      },

      heat_map_container: {
        paddingVertical: scaleByFactor(20),
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      error_message: {
        paddingVertical: scaleByFactor(16),
        fontSize: scaleByFactor(14),
        textAlign: 'center',
      },

      highlighted: {
        color: config.styles.primaryColor,
      },

      spinner: {},
    };
  }

  public lightStyles(): Partial<HeatMapScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },

      top_bar: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      top_bar_button_text: {
        color: config.styles.light.secondaryTextColor,
      },

      year: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<HeatMapScreenStyles> {
    return {
      screen: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },

      top_bar: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      top_bar_button_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      year: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const heatMapScreenResponsiveStyles = new HeatMapScreenResponsiveStyles();
