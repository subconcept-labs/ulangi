/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ForgotPasswordFormStyles {
  form: ViewStyle;
  text_container: ViewStyle;
  text: TextStyle;
  other_containers: ViewStyle;
  touchable_text: TextStyle;
  other_text: TextStyle;
}

export class ForgotPasswordFormResponsiveStyles extends ResponsiveStyleSheet<
  ForgotPasswordFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ForgotPasswordFormStyles {
    return {
      form: {},

      text_container: {
        paddingHorizontal: scaleByFactor(16),
      },

      text: {
        color: '#999',
      },

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

  public lightStyles(): Partial<ForgotPasswordFormStyles> {
    return {};
  }

  public darkStyles(): Partial<ForgotPasswordFormStyles> {
    return {};
  }
}

export const forgotPasswordFormResponsiveStyles = new ForgotPasswordFormResponsiveStyles();
