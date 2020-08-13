/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface BrowserScreenStyles {
  screen: ViewStyle;
  loading_view: ViewStyle;
  spinner: ViewStyle;
}

export class BrowserScreenResponsiveStyles extends ResponsiveStyleSheet<
  BrowserScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): BrowserScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      loading_view: {
        position: 'absolute',
        height: '100%',
        width: '100%',
      },

      spinner: {
        marginVertical: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<BrowserScreenStyles> {
    return {
      loading_view: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },
    };
  }

  public darkStyles(): Partial<BrowserScreenStyles> {
    return {
      loading_view: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },
    };
  }
}

export const browserScreenResponsiveStyles = new BrowserScreenResponsiveStyles();
