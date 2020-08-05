/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ReflexTitleStyles {
  container: ViewStyle;
  title: TextStyle;
}

export class ReflexTitleResponsiveStyles extends ResponsiveStyleSheet<
  ReflexTitleStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ReflexTitleStyles {
    return {
      container: {
        flexDirection: 'row',
      },

      title: {
        fontFamily: 'Raleway-Black',
        fontSize: scaleByFactor(38),
        color: 'white',
        //shadowColor: "#000000",
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.10,
      },
    };
  }

  public lightStyles(): Partial<ReflexTitleStyles> {
    return {};
  }

  public darkStyles(): Partial<ReflexTitleStyles> {
    return {};
  }
}

export const reflexTitleResponsiveStyles = new ReflexTitleResponsiveStyles();
