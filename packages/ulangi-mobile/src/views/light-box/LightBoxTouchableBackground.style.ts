/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface LightBoxTouchableBackgroundStyles {
  light_box_container: ViewStyle;
  background: ViewStyle;
}

export class LightBoxTouchableBackgroundResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxTouchableBackgroundStyles
> {
  public baseStyles(): LightBoxTouchableBackgroundStyles {
    return {
      light_box_container: {},

      background: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#00000075',
      },
    };
  }

  public lightStyles(): Partial<LightBoxTouchableBackgroundStyles> {
    return {};
  }

  public darkStyles(): Partial<LightBoxTouchableBackgroundStyles> {
    return {};
  }
}

export const lightBoxTouchableBackgroundResponsiveStyles = new LightBoxTouchableBackgroundResponsiveStyles();
