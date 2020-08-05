/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LearnScreenStyles {
  screen: ViewStyle;
  top_container: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

export class LearnScreenResponsiveStyles extends ResponsiveStyleSheet<
  LearnScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LearnScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      top_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(16),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
      },

      button: {},

      button_text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<LearnScreenStyles> {
    return {
      top_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },
      button_text: {
        color: '#888',
      },
    };
  }

  public darkStyles(): Partial<LearnScreenStyles> {
    return {
      screen: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#131313',
      },
      top_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },
      button_text: {
        color: '#aaa',
      },
    };
  }
}

export const learnScreenResponsiveStyles = new LearnScreenResponsiveStyles();
