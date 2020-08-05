/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SignUpFormStyles {
  form: ViewStyle;
  other_containers: ViewStyle;
  touchable_text: TextStyle;
  other_text: TextStyle;
}

export class SignUpFormResponsiveStyles extends ResponsiveStyleSheet<
  SignUpFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SignUpFormStyles {
    return {
      form: {},

      other_containers: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: scaleByFactor(16),
        marginTop: scaleByFactor(16),
      },

      touchable_text: {},

      other_text: {
        fontSize: scaleByFactor(15),
        color: config.styles.lightPrimaryColor,
      },
    };
  }

  public lightStyles(): Partial<SignUpFormStyles> {
    return {};
  }

  public darkStyles(): Partial<SignUpFormStyles> {
    return {};
  }
}

export const signUpFormResponsiveStyles = new SignUpFormResponsiveStyles();
