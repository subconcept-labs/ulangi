/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface LightBoxMessageStyles {
  message_container: ViewStyle;
  message: TextStyle;
}

export const baseStyles: LightBoxMessageStyles = {
  message_container: {
    paddingHorizontal: 16,
    paddingVertical: 11,
  },

  message: {
    lineHeight: 19,
    fontSize: 15,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
