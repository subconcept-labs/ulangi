/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface IntervalsScreenStyles {
  row: ViewStyle;
  row_left: ViewStyle;
  row_right: ViewStyle;
  level: TextStyle;
  interval: TextStyle;
}

export const baseStyles: IntervalsScreenStyles = {
  row: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  row_left: {
    flexShrink: 1,
    paddingRight: 16,
  },

  row_right: {},

  level: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  interval: {
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    row: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },
    level: {
      color: config.styles.light.secondaryTextColor,
    },
    interval: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    row: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },
    level: {
      color: config.styles.dark.secondaryTextColor,
    },
    interval: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
