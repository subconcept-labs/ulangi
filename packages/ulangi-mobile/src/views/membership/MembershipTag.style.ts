/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface MembershipTagStyles {
  tag_container: ViewStyle;
  tag_text: TextStyle;
}

export class MembershipTagResponsiveStyles extends ResponsiveStyleSheet<
  MembershipTagStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): MembershipTagStyles {
    return {
      tag_container: {
        alignSelf: 'center',
        marginTop: scaleByFactor(6),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderRadius: scaleByFactor(13),
        paddingHorizontal: scaleByFactor(12),
        height: scaleByFactor(26),
        borderColor: '#F7F7F7',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.5,
        shadowOpacity: 0.1,
        elevation: 0.75,
      },

      tag_text: {
        fontSize: scaleByFactor(12),
        fontWeight: 'bold',
        color: '#30C692',
      },
    };
  }

  public lightStyles(): Partial<MembershipTagStyles> {
    return {};
  }

  public darkStyles(): Partial<MembershipTagStyles> {
    return {};
  }
}

export const membershipTagResponsiveStyles = new MembershipTagResponsiveStyles();
