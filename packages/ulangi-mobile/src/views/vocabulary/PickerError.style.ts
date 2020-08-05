/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface PickerErrorStyles {
  error_container: ViewStyle;
  error_text: TextStyle;
}

export class PickerErrorResponsiveStyles extends ResponsiveStyleSheet<
  PickerErrorStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): PickerErrorStyles {
    return {
      error_container: {
        padding: scaleByFactor(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
      },

      error_text: {
        fontSize: scaleByFactor(14),
        lineHeight: scaleByFactor(19),
      },
    };
  }

  public lightStyles(): Partial<PickerErrorStyles> {
    return {
      error_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      error_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<PickerErrorStyles> {
    return {
      error_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      error_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const pickerErrorResponsiveStyles = new PickerErrorResponsiveStyles();
