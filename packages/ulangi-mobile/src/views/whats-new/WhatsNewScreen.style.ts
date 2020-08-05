/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface WhatsNewScreenStyles {
  screen: ViewStyle;
  spinner: ViewStyle;
}

export class WhatsNewScreenResponsiveStyles extends ResponsiveStyleSheet<
  WhatsNewScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): WhatsNewScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      spinner: {
        marginVertical: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<WhatsNewScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<WhatsNewScreenStyles> {
    return {};
  }
}

export const whatsNewScreenResponsiveStyles = new WhatsNewScreenResponsiveStyles();
