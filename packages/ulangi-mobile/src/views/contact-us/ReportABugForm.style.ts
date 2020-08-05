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

export interface ReportABugFormStyles {
  form: ViewStyle;
  text_container: ViewStyle;
  text: TextStyle;
  bold: TextStyle;
  text_input_container: ViewStyle;
  text_input: TextStyle;
}

export const baseStyles: ReportABugFormStyles = {
  form: {
    flex: 1,
  },

  text_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(10),
  },

  text: {
    paddingVertical: ss(2),
    color: '#333',
    lineHeight: ss(19),
  },

  bold: {
    fontWeight: 'bold',
  },

  text_input_container: {
    flex: 1,
  },

  text_input: {
    flex: 1,
    textAlignVertical: 'top',
    paddingHorizontal: ss(16),
    paddingTop: ss(10),
    paddingBottom: ss(10),
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cecece',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    text: {
      color: config.styles.light.primaryTextColor,
    },

    text_input: {
      color: config.styles.light.primaryTextColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    text: {
      color: config.styles.dark.primaryTextColor,
    },

    text_input: {
      color: config.styles.dark.primaryTextColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
