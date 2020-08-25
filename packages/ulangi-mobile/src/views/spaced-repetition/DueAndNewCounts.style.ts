/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface DueAndNewCountsStyles {
  container: ViewStyle;
  counts: TextStyle;
  highlighted_count: TextStyle;
}

export class DueAndNewCountsResponsiveStyles extends ResponsiveStyleSheet<
  DueAndNewCountsStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): DueAndNewCountsStyles {
    return {
      container: {
        paddingTop: scaleByFactor(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },

      counts: {
        fontSize: scaleByFactor(15),
        textAlign: 'center',
      },

      highlighted_count: {
        fontWeight: 'bold',
        color: '#66BB6A',
      },
    };
  }

  public lightStyles(): Partial<DueAndNewCountsStyles> {
    return {
      counts: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<DueAndNewCountsStyles> {
    return {
      counts: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const dueAndNewCountsResponsiveStyles = new DueAndNewCountsResponsiveStyles();
