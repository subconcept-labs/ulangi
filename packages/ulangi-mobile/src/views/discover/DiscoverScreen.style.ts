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

export interface DiscoverScreenStyles {
  screen: ViewStyle;
  dismiss_view: ViewStyle;
  top_container: ViewStyle;
  message_container: ViewStyle;
  message: TextStyle;
  floating_button_container: ViewStyle;
  header_text: TextStyle;
  highlighted: TextStyle;
}

export class DiscoverScreenResponsiveStyles extends ResponsiveStyleSheet<
  DiscoverScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): DiscoverScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      dismiss_view: {
        flex: 1,
      },

      top_container: {
        borderBottomWidth: 1,
      },

      message_container: {
        flex: 1,
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        justifyContent: 'center',
        alignItems: 'center',
      },

      message: {
        color: '#888',
        fontSize: scaleByFactor(15),
      },

      floating_button_container: {
        position: 'absolute',
        right: scaleByFactor(14),
        bottom: scaleByFactor(14),
      },

      header_text: {
        paddingVertical: scaleByFactor(20),
        paddingHorizontal: scaleByFactor(50),
        fontSize: scaleByFactor(15),
        textAlign: 'center',
      },

      highlighted: {
        color: config.styles.primaryColor,
        fontWeight: 'bold',
      },
    };
  }

  public lightStyles(): Partial<DiscoverScreenStyles> {
    return {
      top_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      header_text: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DiscoverScreenStyles> {
    return {
      top_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      screen: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#131313',
      },

      header_text: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const discoverScreenResponsiveStyles = new DiscoverScreenResponsiveStyles();
