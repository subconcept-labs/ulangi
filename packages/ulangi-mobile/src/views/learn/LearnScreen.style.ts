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
    paddingHorizontal: ss(16),
    paddingVertical: ss(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },

  button: {},

  button_text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ss(15),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    top_container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },
    button_text: {
      color: '#888',
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    screen: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#131313',
    },
    top_container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },
    button_text: {
      color: '#aaa',
    },
  }),
);
