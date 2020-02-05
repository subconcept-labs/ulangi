/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface WritingFormBottomStyles {
  container: ViewStyle;
  horizontal_line: ViewStyle;
}

export const baseStyles: WritingFormBottomStyles = {
  container: {},

  horizontal_line: {
    marginHorizontal: 8,
    height: StyleSheet.hairlineWidth,
  },
};

export const lightStyles: WritingFormBottomStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.light.secondaryBorderColor,
    },
  }),
);

export const darkStyles: WritingFormBottomStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.dark.secondaryBorderColor,
    },
  }),
);
