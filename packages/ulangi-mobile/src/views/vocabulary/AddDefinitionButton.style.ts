/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface AddDefinitionButtonStyles {
  add_button: ViewStyle;
}

export const baseStyles = {
  add_button: {
    height: 30,
    width: 32,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    marginLeft: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.75,
    shadowOpacity: 0.15,
    elevation: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    add_button: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    add_icon: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    add_button: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    add_icon: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
