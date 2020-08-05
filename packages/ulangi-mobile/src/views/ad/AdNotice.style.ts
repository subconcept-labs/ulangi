/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface AdNoticeStyles {
  container: ViewStyle;
  text: TextStyle;
  highlighted: TextStyle;
}

export class AdNoticeResponsiveStyles extends ResponsiveStyleSheet<
  AdNoticeStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): AdNoticeStyles {
    return {
      container: {
        borderRadius: scaleByFactor(5),
        padding: scaleByFactor(12),
        paddingHorizontal: scaleByFactor(16),
        borderColor: '#778899',
        borderWidth: StyleSheet.hairlineWidth,
      },

      text: {
        fontSize: scaleByFactor(14),
        color: '#708090',
      },

      highlighted: {
        color: config.styles.primaryColor,
      },
    };
  }

  public lightStyles(): Partial<AdNoticeStyles> {
    return {};
  }

  public darkStyles(): Partial<AdNoticeStyles> {
    return {};
  }
}

export const adNoticeResponsiveStyles = new AdNoticeResponsiveStyles();
