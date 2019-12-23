/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface ChangePasswordFormStyles {
  form: ViewStyle;
  text_input_container: ViewStyle;
  text_input: TextStyle;
  no_border: ViewStyle;
}

export const baseStyles: ChangePasswordFormStyles = {
  form: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  text_input_container: {
    paddingHorizontal: 8,
  },

  text_input: {
    paddingHorizontal: 8,
    paddingVertical: 13,
    fontSize: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  no_border: {
    borderBottomWidth: 0,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    form: {
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    text_input_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    text_input: {
      color: config.styles.light.primaryTextColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    form: {
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    text_input_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    text_input: {
      color: config.styles.dark.primaryTextColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
