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

export interface EventLogsScreenStyles {
  screen: ViewStyle;
  button_container: ViewStyle;
  paragraph: ViewStyle;
  text: TextStyle;
}

export const baseStyles: EventLogsScreenStyles = {
  screen: {
    flex: 1,
  },

  button_container: {
    marginTop: ss(10),
    paddingHorizontal: ss(16),
  },

  paragraph: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(10),
  },

  text: {
    fontSize: ss(15),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
