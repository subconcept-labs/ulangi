/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface PreloadScreenStyles {
  screen: ViewStyle;
  message: TextStyle;
}

export class PreloadScreenResponsiveStyles extends ResponsiveStyleSheet<
  PreloadScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): PreloadScreenStyles {
    return {
      screen: {
        flex: 1,
        paddingHorizontal: scaleByFactor(16),
        justifyContent: 'center',
        alignItems: 'center',
      },

      message: {
        paddingTop: scaleByFactor(10),
        textAlign: 'center',
        fontSize: scaleByFactor(13),
        color: '#fff',
      },
    };
  }

  public lightStyles(): Partial<PreloadScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<PreloadScreenStyles> {
    return {};
  }
}

export const preloadScreenResponsiveStyles = new PreloadScreenResponsiveStyles();
