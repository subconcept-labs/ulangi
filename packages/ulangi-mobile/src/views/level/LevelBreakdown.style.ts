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
    paddingHorizontal: ss(16),
    paddingVertical: ss(14),
  },

  level: {
    paddingRight: ss(4),
    width: ss(40),
    fontWeight: 'bold',
    fontSize: ss(14),
  },

  count: {
    paddingLeft: ss(4),
    textAlign: 'right',
    width: ss(30),
    fontWeight: 'bold',
    fontSize: ss(14),
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
