/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface ThemeScreenStyles {
  screen: ViewStyle;
}

export class ThemeScreenResponsiveStyles extends ResponsiveStyleSheet<
  ThemeScreenStyles
> {
  public baseStyles(): ThemeScreenStyles {
    return {
      screen: {
        flex: 1,
      },
    };
  }

  public lightStyles(): Partial<ThemeScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<ThemeScreenStyles> {
    return {};
  }
}

export const themeScreenResponsiveStyles = new ThemeScreenResponsiveStyles();
