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

export interface CategoryFormStyles {
  container: ViewStyle;
  category_input_container: ViewStyle;
  category_input: TextStyle;
}

export const baseStyles: CategoryFormStyles = {
  container: {
    flex: 1,
    paddingBottom: ss(24),
  },

  category_input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ss(16),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  category_input: {
    flex: 1,
    height: ss(44),
    fontSize: ss(16),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    category_input_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    category_input: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    category_input_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    category_input: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
