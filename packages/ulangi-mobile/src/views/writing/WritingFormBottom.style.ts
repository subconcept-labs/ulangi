/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface WritingFormBottomStyles {
  container: ViewStyle;
  horizontal_line: ViewStyle;
}

export class WritingFormBottomResponsiveStyles extends ResponsiveStyleSheet<
  WritingFormBottomStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): WritingFormBottomStyles {
    return {
      container: {},

      horizontal_line: {
        marginHorizontal: scaleByFactor(8),
        height: StyleSheet.hairlineWidth,
      },
    };
  }

  public lightStyles(): Partial<WritingFormBottomStyles> {
    return {
      container: {
        borderTopColor: config.styles.light.primaryBorderColor,
        borderBottomColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.secondaryBackgroundColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.light.secondaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<WritingFormBottomStyles> {
    return {
      container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
        borderBottomColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      horizontal_line: {
        backgroundColor: config.styles.dark.secondaryBorderColor,
      },
    };
  }
}

export const writingFormBottomResponsiveStyles = new WritingFormBottomResponsiveStyles();
