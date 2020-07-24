/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface CategoryDetailHeaderStyles {
  container: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

export const baseStyles: CategoryDetailHeaderStyles = {
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Shrink the button if set name is too long
    flexShrink: 1,
  },

  button_text: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: 15,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    button_text: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    button_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
