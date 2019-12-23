/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface LevelBreakdownStyles {
  container: ViewStyle;
  row_container: ViewStyle;
  level: TextStyle;
  count: TextStyle;
}

export const baseStyles: LevelBreakdownStyles = {
  container: {},

  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  level: {
    paddingRight: 4,
    width: 40,
    fontWeight: 'bold',
    fontSize: 14,
  },

  count: {
    paddingLeft: 4,
    textAlign: 'right',
    width: 30,
    fontWeight: 'bold',
    fontSize: 14,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    row_container: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },

    level: {
      color: config.styles.light.secondaryTextColor,
    },

    count: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    row_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },

    level: {
      color: config.styles.dark.secondaryTextColor,
    },

    count: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
