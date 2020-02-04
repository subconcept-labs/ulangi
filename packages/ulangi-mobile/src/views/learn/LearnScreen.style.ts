/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export interface LearnScreenStyles {
  screen: ViewStyle;
  top_container: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

const baseStyles: LearnScreenStyles = {
  screen: {
    flex: 1,
  },

  top_container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {},

  button_text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    button_text: {
      color: '#888',
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    button_text: {
      color: '#aaa',
    },
  }),
);
