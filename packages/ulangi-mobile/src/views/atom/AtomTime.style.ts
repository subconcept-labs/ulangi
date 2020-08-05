/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AtomTimeStyles {
  container: ViewStyle;
  time_text: TextStyle;
}

export class AtomTimeResponsiveStyles extends ResponsiveStyleSheet<
  AtomTimeStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomTimeStyles {
    return {
      container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      time_text: {
        color: config.atom.textColor,
        fontSize: scaleByFactor(34),
        fontFamily: 'JosefinSans-Bold',
      },
    };
  }

  public lightStyles(): Partial<AtomTimeStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomTimeStyles> {
    return {};
  }
}

export const atomTimeResponsiveStyles = new AtomTimeResponsiveStyles();
