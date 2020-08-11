/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface AtomMenuStyles {
  container: ViewStyle;
}

export class AtomMenuResponsiveStyles extends ResponsiveStyleSheet<
  AtomMenuStyles
> {
  public baseStyles(
    _: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): AtomMenuStyles {
    return {
      container: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },
    };
  }

  public lightStyles(): Partial<AtomMenuStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomMenuStyles> {
    return {};
  }
}

export const atomMenuResponsiveStyles = new AtomMenuResponsiveStyles();
