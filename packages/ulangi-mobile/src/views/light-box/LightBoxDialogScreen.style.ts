/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxDialogScreenStyles {
  screen: ViewStyle;
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
}

export class LightBoxDialogScreenResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxDialogScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxDialogScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      light_box_container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(16),
      },

      inner_container: {
        flexShrink: 1,
      },
    };
  }

  public lightStyles(): Partial<LightBoxDialogScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<LightBoxDialogScreenStyles> {
    return {};
  }
}

export const lightBoxDialogScreenResponsiveStyles = new LightBoxDialogScreenResponsiveStyles();
