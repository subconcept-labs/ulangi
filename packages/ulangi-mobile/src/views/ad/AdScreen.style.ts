/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AdScreenStyles {
  screen: ViewStyle;
  button_container: ViewStyle;
  text: TextStyle;
}

export class AdScreenResponsiveStyles extends ResponsiveStyleSheet<
  AdScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AdScreenStyles {
    return {
      screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      button_container: {
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'flex-end',
        padding: scaleByFactor(16),
      },

      text: {
        fontSize: scaleByFactor(12),
        fontWeight: '700',
        color: '#999',
        paddingTop: scaleByFactor(10),
      },
    };
  }

  public lightStyles(): Partial<AdScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AdScreenStyles> {
    return {};
  }
}

export const adScreenResponsiveStyles = new AdScreenResponsiveStyles();
