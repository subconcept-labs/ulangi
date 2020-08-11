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

export interface SignInFormStyles {
  form: ViewStyle;
  other_containers: ViewStyle;
  touchable_text: TextStyle;
  other_text: TextStyle;
}

export class SignInFormResponsiveStyles extends ResponsiveStyleSheet<
  SignInFormStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): SignInFormStyles {
    return {
      form: {
        flex: 1,
      },

      other_containers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        marginTop: scaleByFactor(16),
      },

      touchable_text: {},

      other_text: {
        fontSize: scaleByFactor(15),
        color: config.styles.lightPrimaryColor,
      },
    };
  }

  public lightStyles(): Partial<SignInFormStyles> {
    return {};
  }

  public darkStyles(): Partial<SignInFormStyles> {
    return {};
  }
}

export const signInFormResponsiveStyles = new SignInFormResponsiveStyles();
