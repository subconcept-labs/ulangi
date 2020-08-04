/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface LightBoxActionItemStyles {
  item_container: ViewStyle;
  last_item_style: ViewStyle;
  item_button: ViewStyle;
  item_text: TextStyle;
}

export const baseStyles: LightBoxActionItemStyles = {
  item_container: {
    marginHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  last_item_style: {
    borderBottomWidth: 0,
  },

  item_button: {
    paddingVertical: ss(14),
    paddingHorizontal: ss(8),
  },

  item_text: {
    fontSize: ss(15),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderBottomColor: config.styles.light.secondaryBorderColor,
    },

    item_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderBottomColor: config.styles.dark.secondaryBorderColor,
    },

    item_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
