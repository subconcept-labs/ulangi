/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface WelcomeScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  logo_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  yes_btn: ViewStyle;
  yes_btn_text: TextStyle;
  no_btn: ViewStyle;
  no_text: TextStyle;
}

export class WelcomeScreenResponsiveStyles extends ResponsiveStyleSheet<
  WelcomeScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): WelcomeScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      container: {
        flex: 1,
      },

      logo_container: {
        marginTop: scaleByFactor(20),
      },

      title_container: {
        marginTop: scaleByFactor(30),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      title: {
        textAlign: 'center',
        fontSize: scaleByFactor(18),
        fontWeight: 'bold',
        color: 'white',
      },

      yes_btn: {
        backgroundColor: '#64d392',
      },

      yes_btn_text: {
        color: '#fff',
      },

      no_btn: {
        marginTop: scaleByFactor(10),
        marginBottom: scaleByFactor(20),
      },

      no_text: {},
    };
  }

  public lightStyles(): Partial<WelcomeScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<WelcomeScreenStyles> {
    return {};
  }
}

export const welcomeScreenResponsiveStyles = new WelcomeScreenResponsiveStyles();
