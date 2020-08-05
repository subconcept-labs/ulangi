/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface PrivacyPolicyScreenStyles {
  screen: ViewStyle;
  spinner: ViewStyle;
}

export class PrivacyPolicyScreenResponsiveStyles extends ResponsiveStyleSheet<
  PrivacyPolicyScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): PrivacyPolicyScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      spinner: {
        marginVertical: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<PrivacyPolicyScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<PrivacyPolicyScreenStyles> {
    return {};
  }
}

export const privacyPolicyScreenResponsiveStyles = new PrivacyPolicyScreenResponsiveStyles();
