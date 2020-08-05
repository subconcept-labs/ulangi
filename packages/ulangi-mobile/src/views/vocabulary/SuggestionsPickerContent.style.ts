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

export interface SuggestionsPickerContentStyles {
  picker_content: ViewStyle;
  no_suggestions_text: TextStyle;
  highlighted_text: TextStyle;
  bold: TextStyle;
}

export const baseStyles: SuggestionsPickerContentStyles = {
  picker_content: {},

  no_suggestions_text: {
    paddingVertical: ss(10),
    textAlign: 'center',
    fontSize: ss(14),
  },

  highlighted_text: {
    color: config.styles.primaryColor,
  },

  bold: {
    fontWeight: 'bold',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    no_suggestions_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    no_suggestions_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
