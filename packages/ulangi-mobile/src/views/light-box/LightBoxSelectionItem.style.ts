/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface LightBoxSelectionItemStyles {
  last_item: ViewStyle;
  item_container: ViewStyle;
  item_touchable: ViewStyle;
  select_icon: ImageStyle;
  item_icon: ImageStyle;
  text: TextStyle;
}

export const baseStyles: LightBoxSelectionItemStyles = {
  last_item: {
    borderBottomWidth: 0,
  },

  item_container: {
    marginHorizontal: ss(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  item_touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ss(13),
    paddingHorizontal: ss(8),
  },

  select_icon: {
    marginRight: ss(10),
  },

  item_icon: {
    marginRight: ss(6),
  },

  text: {
    flexShrink: 1,
    fontSize: ss(15),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderBottomColor: config.styles.light.secondaryBorderColor,
    },

    text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderBottomColor: config.styles.dark.secondaryBorderColor,
    },

    text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
