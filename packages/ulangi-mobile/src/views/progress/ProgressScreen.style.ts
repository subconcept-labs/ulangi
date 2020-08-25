/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface ProgressScreenStyles {
  screen: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  view_heat_map_button_container: TextStyle;
  note: TextStyle;
  heat_map_container: ViewStyle;
  heat_map: ViewStyle;
  statistics_container: ViewStyle;
  statistics_list: ViewStyle;
  statistics_row: ViewStyle;
  statistics_item: ViewStyle;
  count: TextStyle;
  spinner: ViewStyle;
  error_message: TextStyle;
  highlighted: TextStyle;
}

export class ProgressScreenResponsiveStyles extends ResponsiveStyleSheet<
  ProgressScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): ProgressScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      title: {
        fontSize: scaleByFactor(15),
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: -0.5,
      },

      subtitle: {
        fontSize: scaleByFactor(14),
        textAlign: 'center',
      },

      view_heat_map_button_container: {
        marginTop: scaleByFactor(14),
        flexDirection: 'row',
        justifyContent: 'center',
      },

      note: {
        fontSize: scaleByFactor(13),
      },

      heat_map_container: {
        marginTop: scaleByFactor(20),
        paddingTop: scaleByFactor(10),
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      heat_map: {
        paddingVertical: scaleByFactor(16),
      },

      statistics_container: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        marginTop: scaleByFactor(20),
        paddingVertical: scaleByFactor(20),
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      statistics_list: {
        marginTop: scaleByFactor(10),
      },

      statistics_row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      },

      statistics_item: {
        flex: 1,
        paddingHorizontal: scaleByFactor(20),
        paddingVertical: scaleByFactor(12),
      },

      count: {
        fontSize: scaleByFactor(40),
        textAlign: 'center',
        fontWeight: 'bold',
      },

      spinner: {
        paddingVertical: scaleByFactor(16),
      },

      error_message: {
        paddingVertical: scaleByFactor(16),
        fontSize: scaleByFactor(14),
        textAlign: 'center',
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<ProgressScreenStyles> {
    return {
      title: {
        color: config.styles.light.primaryTextColor,
      },

      subtitle: {
        color: config.styles.light.secondaryTextColor,
      },

      statistics_container: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },

      count: {
        color: config.styles.light.primaryTextColor,
      },

      note: {
        color: config.styles.light.secondaryTextColor,
      },

      error_message: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ProgressScreenStyles> {
    return {
      screen: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#131313',
      },

      title: {
        color: config.styles.dark.primaryTextColor,
      },

      subtitle: {
        color: config.styles.dark.secondaryTextColor,
      },

      statistics_container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },

      count: {
        color: config.styles.dark.primaryTextColor,
      },

      note: {
        color: config.styles.dark.secondaryTextColor,
      },

      error_message: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const progressScreenResponsiveStyles = new ProgressScreenResponsiveStyles();
