/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface LightBoxSelectionItemStyles {
  last_item: ViewStyle;
  item_container: ViewStyle;
  item_touchable: ViewStyle;
  select_icon: ImageStyle;
  item_icon: ImageStyle;
  text: TextStyle;
}

export class LightBoxSelectionItemResponsiveStyles extends ResponsiveStyleSheet<
  LightBoxSelectionItemStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): LightBoxSelectionItemStyles {
    return {
      last_item: {
        borderBottomWidth: 0,
      },

      item_container: {
        marginHorizontal: scaleByFactor(8),
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

      item_touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleByFactor(13),
        paddingHorizontal: scaleByFactor(8),
      },

      select_icon: {
        marginRight: scaleByFactor(10),
      },

      item_icon: {
        marginRight: scaleByFactor(6),
      },

      text: {
        flexShrink: 1,
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<LightBoxSelectionItemStyles> {
    return {
      item_container: {
        borderBottomColor: config.styles.light.secondaryBorderColor,
      },

      text: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<LightBoxSelectionItemStyles> {
    return {
      item_container: {
        borderBottomColor: config.styles.dark.secondaryBorderColor,
      },

      text: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const lightBoxSelectionItemResponsiveStyles = new LightBoxSelectionItemResponsiveStyles();
