/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SignUpScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  logo_container: ViewStyle;
  form_container: ViewStyle;
}

export class SignUpScreenResponsiveStyles extends ResponsiveStyleSheet<
  SignUpScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SignUpScreenStyles {
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
    };
  }

  public lightStyles(): Partial<SignUpScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<SignUpScreenStyles> {
    return {};
  }
}

export const signUpScreenResponsiveStyles = new SignUpScreenResponsiveStyles();
