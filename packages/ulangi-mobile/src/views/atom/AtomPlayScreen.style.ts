/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface AtomPlayScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
}

export class AtomPlayScreenResponsiveStyles extends ResponsiveStyleSheet<
  AtomPlayScreenStyles
> {
  public baseStyles(): AtomPlayScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      container: {
        flex: 1,
      },
    };
  }

  public lightStyles(): Partial<AtomPlayScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomPlayScreenStyles> {
    return {};
  }
}

export const atomPlayScreenResponsiveStyles = new AtomPlayScreenResponsiveStyles();
