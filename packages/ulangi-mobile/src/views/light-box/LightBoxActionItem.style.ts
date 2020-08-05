/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxActionItemStyles {
  item_container: ViewStyle;
  last_item_style: ViewStyle;
  item_button: ViewStyle;
  item_text: TextStyle;
}

export class LightBoxActionItemResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxActionItemStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxActionItemStyles {
    return {
      item_container: {
        marginHorizontal: scaleByFactor(8),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      last_item_style: {
        borderBottomWidth: 0,
      },

      item_button: {
        paddingVertical: scaleByFactor(14),
        paddingHorizontal: scaleByFactor(8),
      },

      item_text: {
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<LightBoxActionItemStyles> {
    return {
      item_container: {
        borderBottomColor: config.styles.light.secondaryBorderColor,
      },

      item_text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LightBoxActionItemStyles> {
    return {
      item_container: {
        borderBottomColor: config.styles.dark.secondaryBorderColor,
      },

      item_text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const lightBoxActionItemResponsiveStyles = new LightBoxActionItemResponsiveStyles();
