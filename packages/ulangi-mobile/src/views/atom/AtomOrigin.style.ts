/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AtomOriginStyles {
  container: ViewStyle;
  move_count: TextStyle;
}

export class AtomOriginResponsiveStyles extends ResponsiveStyleSheet<
  AtomOriginStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AtomOriginStyles {
    return {
      container: {
        backgroundColor: config.atom.secondaryColor,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.8,
        shadowOpacity: 0.2,
      },

      move_count: {
        color: '#fff',
        fontFamily: 'JosefinSans-Bold',
        fontSize: scaleByFactor(18),
        marginTop: scaleByFactor(2),
      },
    };
  }

  public lightStyles(): Partial<AtomOriginStyles> {
    return {};
  }

  public darkStyles(): Partial<AtomOriginStyles> {
    return {};
  }
}

export const atomOriginResponsiveStyles = new AtomOriginResponsiveStyles();
