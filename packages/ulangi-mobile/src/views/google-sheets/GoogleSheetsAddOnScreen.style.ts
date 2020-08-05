/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface GoogleSheetsAddOnScreenStyles {
  screen: ViewStyle;
  intro_container: ViewStyle;
  intro_text: TextStyle;
  tutorial_text: TextStyle;
  section_container: ViewStyle;
  password_input: TextStyle;
  api_key: TextStyle;
  expired_text: TextStyle;
  action_container: ViewStyle;
  primary_text: TextStyle;
  invalidate_text: TextStyle;
  dot: TextStyle;
  highlighted: TextStyle;
}

export class GoogleSheetsAddOnScreenResponsiveStyles extends ResponsiveStyleSheet<
  GoogleSheetsAddOnScreenStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): GoogleSheetsAddOnScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      intro_container: {
        paddingHorizontal: scaleByFactor(16),
      },

      api_key: {
        fontSize: scaleByFactor(15),
      },

      intro_text: {
        fontSize: scaleByFactor(15),
      },

      tutorial_text: {
        paddingTop: scaleByFactor(5),
        fontSize: scaleByFactor(15),
      },

      section_container: {
        marginTop: scaleByFactor(16),
      },

      password_input: {
        flex: 1,
      },

      expired_text: {},

      action_container: {
        marginTop: scaleByFactor(4),
        flexDirection: 'row',
        alignItems: 'center',
      },

      primary_text: {
        color: config.styles.primaryColor,
      },

      invalidate_text: {
        color: 'orangered',
      },

      dot: {
        paddingHorizontal: scaleByFactor(8),
        fontSize: scaleByFactor(17),
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<GoogleSheetsAddOnScreenStyles> {
    return {
      intro_text: {
        color: config.styles.light.primaryTextColor,
      },

      api_key: {
        color: config.styles.light.primaryTextColor,
      },

      expired_text: {
        color: config.styles.light.secondaryTextColor,
      },

      dot: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<GoogleSheetsAddOnScreenStyles> {
    return {
      intro_text: {
        color: config.styles.dark.primaryTextColor,
      },

      api_key: {
        color: config.styles.dark.primaryTextColor,
      },

      expired_text: {
        color: config.styles.dark.secondaryTextColor,
      },

      dot: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const googleSheetsAddOnScreenResponsiveStyles = new GoogleSheetsAddOnScreenResponsiveStyles();
