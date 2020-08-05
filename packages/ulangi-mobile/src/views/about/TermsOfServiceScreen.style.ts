/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface TermsOfServiceScreenStyles {
  screen: ViewStyle;
  spinner: ViewStyle;
}

export class TermsOfServiceScreenResponsiveStyles extends ResponsiveStyleSheet<
  TermsOfServiceScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): TermsOfServiceScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      spinner: {
        marginVertical: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<TermsOfServiceScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<TermsOfServiceScreenStyles> {
    return {};
  }
}

export const termsOfServiceScreenResponsiveStyles = new TermsOfServiceScreenResponsiveStyles();
