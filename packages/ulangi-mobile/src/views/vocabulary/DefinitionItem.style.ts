/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DefinitionItemStyle {
  item_container: ViewStyle;
  meaning_container: ViewStyle;
  plain_meaning_container: ViewStyle;
  plain_meaning: TextStyle;
}

export const baseStyles: DefinitionItemStyle = {
  item_container: {
    paddingVertical: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  meaning_container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  plain_meaning_container: {
    flexShrink: 1,
    paddingVertical: 3,
  },

  plain_meaning: {
    fontSize: 17,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },
    plain_meaning: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },
    plain_meaning: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
