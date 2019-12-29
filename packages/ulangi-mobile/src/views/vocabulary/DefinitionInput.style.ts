/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DefinitionInputStyles {
  meaning_container: ViewStyle;

  meaning_input: TextStyle;
}

export const baseStyles: DefinitionInputStyles = {
  meaning_container: {
    paddingHorizontal: 16,
  },

  meaning_input: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    meaning_input: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    meaning_input: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
