/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface ManageBarStyles {
  container: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

export class ManageBarResponsiveStyles extends ResponsiveStyleSheet<
  ManageBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): ManageBarStyles {
    return {
      container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // Shrink the button if set name is too long
        flexShrink: 1,
      },

      button_text: {
        fontWeight: 'bold',
        color: '#888',
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<ManageBarStyles> {
    return {
      container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      button_text: {
        color: config.styles.light.secondaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<ManageBarStyles> {
    return {
      container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      button_text: {
        color: config.styles.dark.secondaryTextColor,
      },
    };
  }
}

export const manageBarResponsiveStyles = new ManageBarResponsiveStyles();
