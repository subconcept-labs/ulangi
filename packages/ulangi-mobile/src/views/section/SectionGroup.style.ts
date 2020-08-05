/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface SectionGroupStyles {
  section_container: ViewStyle;
  header: TextStyle;
  item_container: ViewStyle;
}

export class SectionGroupResponsiveStyles extends ResponsiveStyleSheet<
  SectionGroupStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): SectionGroupStyles {
    return {
      section_container: {
        marginBottom: scaleByFactor(22),
      },

      header: {
        fontSize: scaleByFactor(12),
        paddingHorizontal: scaleByFactor(16),
        paddingBottom: scaleByFactor(8),
      },

      item_container: {
        borderTopWidth: StyleSheet.hairlineWidth,
      },
    };
  }

  public lightStyles(): Partial<SectionGroupStyles> {
    return {
      header: {
        color: config.styles.light.secondaryTextColor,
      },

      item_container: {
        borderTopColor: config.styles.light.primaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<SectionGroupStyles> {
    return {
      header: {
        color: config.styles.dark.secondaryTextColor,
      },

      item_container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },
    };
  }
}

export const sectionGroupResponsiveStyles = new SectionGroupResponsiveStyles();
