/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SignInScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  logo_container: ViewStyle;
  form_container: ViewStyle;
  sign_in_as_guest_container: ViewStyle;
  sign_in_as_guest_btn: ViewStyle;
  sign_in_as_guest_btn_text: TextStyle;
  sign_in_as_guest_note: TextStyle;
}

export class SignInScreenResponsiveStyles extends ResponsiveStyleSheet<
  SignInScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SignInScreenStyles {
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

      form_container: {
        marginTop: scaleByFactor(20),
        flex: 1,
      },

      sign_in_as_guest_container: {
        marginBottom: scaleByFactor(30),
      },

      sign_in_as_guest_btn: {
        backgroundColor: '#64d392',
      },

      sign_in_as_guest_btn_text: {
        color: '#fff',
      },

      sign_in_as_guest_note: {
        paddingHorizontal: scaleByFactor(16),
        paddingTop: scaleByFactor(10),
        textAlign: 'center',
        fontSize: scaleByFactor(15),
        color: config.styles.lightPrimaryColor,
      },
    };
  }

  public lightStyles(): Partial<SignInScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<SignInScreenStyles> {
    return {};
  }
}

export const signInScreenResponsiveStyles = new SignInScreenResponsiveStyles();
