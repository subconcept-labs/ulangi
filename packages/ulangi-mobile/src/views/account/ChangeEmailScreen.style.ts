/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ChangeEmailScreenStyles {
  screen: ViewStyle;
  guest_note_container: ViewStyle;
  guest_note: TextStyle;
  bold: TextStyle;
}

export class ChangeEmailScreenResponsiveStyles extends ResponsiveStyleSheet<
  ChangeEmailScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ChangeEmailScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      guest_note_container: {
        padding: scaleByFactor(16),
      },

      guest_note: {
        color: '#222',
        fontSize: scaleByFactor(15),
      },

      bold: {
        fontWeight: '700',
      },
    };
  }

  public lightStyles(): Partial<ChangeEmailScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<ChangeEmailScreenStyles> {
    return {};
  }
}

export const changeEmailScreenResponsiveStyles = new ChangeEmailScreenResponsiveStyles();
