/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface PickerLoadingStyles {
  spinner_container: ViewStyle;
  spinner: ViewStyle;
  spinner_text: TextStyle;
}

export class PickerLoadingResponsiveStyles extends ResponsiveStyleSheet<
  PickerLoadingStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): PickerLoadingStyles {
    return {
      spinner_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: scaleByFactor(16),
      },

      spinner: {
        marginRight: scaleByFactor(5),
      },

      spinner_text: {
        fontSize: scaleByFactor(14),
      },
    };
  }

  public lightStyles(): Partial<PickerLoadingStyles> {
    return {
      spinner_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      spinner_text: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<PickerLoadingStyles> {
    return {
      spinner_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      spinner_text: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const pickerLoadingResponsiveStyles = new PickerLoadingResponsiveStyles();
