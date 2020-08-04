/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ls, ss } from '../../utils/responsive';

export interface SetUpAccountScreenStyles {
  screen: ViewStyle;
  form: ViewStyle;
  text_input_container: ViewStyle;
  text_input: TextStyle;
  submit_btn_container: ViewStyle;
}

export const baseStyles: SetUpAccountScreenStyles = {
  screen: {
    flex: 1,
  },

  form: {
    flex: 1,
    marginTop: ss(16),
    paddingHorizontal: ls(16),
  },

  text_input_container: {
    marginVertical: ss(5),
    borderRadius: ss(5),
    borderWidth: StyleSheet.hairlineWidth,
  },

  text_input: {
    paddingHorizontal: ss(12),
    paddingVertical: ss(12),
    fontSize: ss(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  submit_btn_container: {
    marginTop: ss(8),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    text_input_container: {
      borderColor: config.styles.light.primaryBorderColor,
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
    text_input_container: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    text_input: {
      color: config.styles.dark.primaryTextColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
