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

export interface LightBoxActionMenuScreenStyles {
  screen: ViewStyle;
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
}

export class LightBoxActionMenuScreenResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxActionMenuScreenStyles
> {
  public baseStyles(
    _: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): LightBoxActionMenuScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      light_box_container: {
        justifyContent: 'center',
        paddingVertical: 150,
        paddingHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
      },

      inner_container: {
        flexShrink: 1,
      },
    };
  }

  public lightStyles(): Partial<LightBoxActionMenuScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<LightBoxActionMenuScreenStyles> {
    return {};
  }
}

export const lightBoxActionMenuScreenResponsiveStyles = new LightBoxActionMenuScreenResponsiveStyles();
