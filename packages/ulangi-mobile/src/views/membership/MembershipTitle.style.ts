/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface MembershipTitleStyles {
  title: TextStyle;
}

export class MembershipTitleResponsiveStyles extends ResponsiveStyleSheet<
  MembershipTitleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): MembershipTitleStyles {
    return {
      title: {
        fontFamily: 'Raleway-Black',
        fontSize: scaleByFactor(38),
        color: 'white',
        textAlign: 'center',
      },
    };
  }

  public lightStyles(): Partial<MembershipTitleStyles> {
    return {};
  }

  public darkStyles(): Partial<MembershipTitleStyles> {
    return {};
  }
}

export const membershipTitleResponsiveStyles = new MembershipTitleResponsiveStyles();
