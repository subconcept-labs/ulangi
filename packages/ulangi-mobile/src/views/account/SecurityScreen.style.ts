/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SecurityScreenStyles {
  screen: ViewStyle;
  section_list: ViewStyle;
}

export class SecurityScreenResponsiveStyles extends ResponsiveStyleSheet<
  SecurityScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SecurityScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      section_list: {
        flex: 1,
        marginTop: scaleByFactor(22),
      },
    };
  }

  public lightStyles(): Partial<SecurityScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<SecurityScreenStyles> {
    return {};
  }
}

export const securityScreenResponsiveStyles = new SecurityScreenResponsiveStyles();
