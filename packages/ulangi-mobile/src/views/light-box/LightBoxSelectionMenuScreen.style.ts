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

export interface LightBoxSelectionMenuScreenStyles {
  screen: ViewStyle;
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
}

export class LightBoxSelectionMenuScreenResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxSelectionMenuScreenStyles
> {
  public baseStyles(
    _: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): LightBoxSelectionMenuScreenStyles {
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

  public lightStyles(): Partial<LightBoxSelectionMenuScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<LightBoxSelectionMenuScreenStyles> {
    return {};
  }
}

export const lightBoxSelectionMenuScreenResponsiveStyles = new LightBoxSelectionMenuScreenResponsiveStyles();
