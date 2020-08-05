/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet } from '../../utils/responsive';

export interface DiscoverNavBarStyles {
  container: ViewStyle;
}

export class DiscoverNavBarResponsiveStyles extends ResponsiveStyleSheet<
  DiscoverNavBarStyles
> {
  public baseStyles(): DiscoverNavBarStyles {
    return {
      container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
  }

  public lightStyles(): Partial<DiscoverNavBarStyles> {
    return {};
  }

  public darkStyles(): Partial<DiscoverNavBarStyles> {
    return {};
  }
}

export const discoverNavBarResponsiveStyles = new DiscoverNavBarResponsiveStyles();
