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

export interface QuizMultipleChoiceResultStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  table: ViewStyle;
  row: ViewStyle;
  horizontal_line: TextStyle;
  bold: TextStyle;
  button_container: ViewStyle;
}

export const baseStyles: QuizMultipleChoiceResultStyles = {
  container: {
    flex: 1,
  },

  title_container: {
    marginTop: ss(30),
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: ss(16),
    fontWeight: 'bold',
  },

  table: {
    marginTop: ss(20),
    paddingHorizontal: ss(16),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ss(4),
  },

  horizontal_line: {
    height: 1,
    marginVertical: ss(12),
  },

  bold: {
    fontWeight: 'bold',
  },

  button_container: {
    marginTop: ss(8),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.light.primaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
