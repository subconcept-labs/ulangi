/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReflexPausedScreenStyles {
  screen: ViewStyle;
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  spacer: ViewStyle;
}

export class ReflexPausedScreenResponsiveStyles extends ResponsiveStyleSheet<
  ReflexPausedScreenStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReflexPausedScreenStyles {
    return {
      screen: {
        flex: 1,
      },

      light_box_container: {
        justifyContent: 'center',
        paddingHorizontal: scaleByFactor(16),
      },

      inner_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      title_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scaleByFactor(8),
      },

      title: {
        fontSize: scaleByFactor(34),
        fontFamily: 'Raleway-Black',
        color: '#fff',
      },

      spacer: {
        height: scaleByFactor(30),
      },
    };
  }

  public lightStyles(): Partial<ReflexPausedScreenStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexPausedScreenStyles> {
    return {};
  }
}

export const reflexPausedScreenResponsiveStyles = new ReflexPausedScreenResponsiveStyles();
