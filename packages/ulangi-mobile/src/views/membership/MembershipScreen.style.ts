/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface MembershipScreenStyles {
  screen: ViewStyle;
  content_container: ViewStyle;
}

export class MembershipScreenResponsiveStyles extends ResponsiveStyleSheet<
  MembershipScreenStyles
> {
  public baseStyles(): MembershipScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      content_container: {
        flexGrow: 1,
      },
    };
  }

  public lightStyles(): Partial<MembershipScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<MembershipScreenStyles> {
    return {};
  }
}

export const membershipScreenResponsiveStyles = new MembershipScreenResponsiveStyles();
