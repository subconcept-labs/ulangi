/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface StrokeOrdersStyles {
  webview: ViewStyle;
}

export class StrokeOrdersResponsiveStyles extends ResponsiveStyleSheet<
  StrokeOrdersStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): StrokeOrdersStyles {
    return {
      webview: {
        marginVertical: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<StrokeOrdersStyles> {
    return {};
  }

  public darkStyles(): Partial<StrokeOrdersStyles> {
    return {};
  }
}

export const strokeOrdersResponsiveStyles = new StrokeOrdersResponsiveStyles();
