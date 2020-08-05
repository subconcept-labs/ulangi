/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxButtonListStyles {
  button_list_container: ViewStyle;
  button_container: ViewStyle;
}

export class LightBoxButtonListResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxButtonListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxButtonListStyles {
    return {
      button_list_container: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleByFactor(8),
        paddingBottom: scaleByFactor(12),
      },

      button_container: {
        paddingHorizontal: scaleByFactor(8),
      },
    };
  }

  public lightStyles(): Partial<LightBoxButtonListStyles> {
    return {};
  }

  public darkStyles(): Partial<LightBoxButtonListStyles> {
    return {};
  }
}

export const lightBoxButtonListResponsiveStyles = new LightBoxButtonListResponsiveStyles();
