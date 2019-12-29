/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface PickerErrorStyles {
  error_container: ViewStyle;
  error_text: TextStyle;
}

export const baseStyles: PickerErrorStyles = {
  error_container: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },

  error_text: {
    fontSize: 14,
    lineHeight: 19,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    error_container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    error_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    error_container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    error_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
