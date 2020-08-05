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

export interface LightBoxMessageStyles {
  message_container: ViewStyle;
  message: TextStyle;
}

export const baseStyles: LightBoxMessageStyles = {
  message_container: {
    alignSelf: 'stretch',
    paddingHorizontal: ss(16),
    paddingVertical: ss(11),
  },

  message: {
    lineHeight: ss(19),
    fontSize: ss(15),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
