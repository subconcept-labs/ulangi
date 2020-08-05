/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface MembershipLabelStyles {
  label_container: ViewStyle;
  label: TextStyle;
}

export class MembershipLabelResponsiveStyles extends ResponsiveStyleSheet<
  MembershipLabelStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): MembershipLabelStyles {
    return {
      label_container: {
        alignSelf: 'center',
      },

      label: {
        paddingVertical: scaleByFactor(4),
        color: 'black',
        fontSize: scaleByFactor(12),
        fontWeight: '700',
        opacity: scaleByFactor(0.3),
      },
    };
  }

  public lightStyles(): Partial<MembershipLabelStyles> {
    return {};
  }

  public darkStyles(): Partial<MembershipLabelStyles> {
    return {};
  }
}

export const membershipLabelResponsiveStyles = new MembershipLabelResponsiveStyles();
