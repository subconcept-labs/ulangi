/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
} from '../../utils/responsive';

export interface UpgradeButtonStyles {
  button_container: ViewStyle;
  text_container: ViewStyle;
  text: TextStyle;
  price_container: ViewStyle;
  price: TextStyle;
  currency: TextStyle;
}

export class UpgradeButtonResponsiveStyles extends ResponsiveStyleSheet<
  UpgradeButtonStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): UpgradeButtonStyles {
    return {
      button_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#5C6BC0',
        marginHorizontal: scaleByBreakpoints([16, 116, 216, 316]),
        paddingVertical: scaleByFactor(12),
        paddingHorizontal: scaleByFactor(16),
        borderRadius: scaleByFactor(5),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        elevation: 1,
      },

      text_container: {
        paddingRight: scaleByFactor(14),
        flexShrink: 1,
      },

      text: {
        fontSize: scaleByFactor(16),
        fontWeight: '700',
        color: '#fff',
      },

      price_container: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: '#f9f9f9',
        paddingLeft: scaleByFactor(14),
      },

      price: {
        fontSize: scaleByFactor(18),
        fontWeight: '700',
        color: '#fff',
      },

      currency: {
        fontSize: scaleByFactor(13),
        fontWeight: '700',
        color: '#fff',
      },
    };
  }

  public lightStyles(): Partial<UpgradeButtonStyles> {
    return {};
  }

  public darkStyles(): Partial<UpgradeButtonStyles> {
    return {};
  }
}

export const upgradeButtonResponsiveStyles = new UpgradeButtonResponsiveStyles();
