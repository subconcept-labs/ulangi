/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface PublicSetListStyles {
  list_container: ViewStyle;
  center_container: ViewStyle;
  message: TextStyle;
  button_container: ViewStyle;
}

export const baseStyles: PublicSetListStyles = {
  list_container: {
    paddingBottom: 74,
    paddingTop: 8,
  },

  center_container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    fontSize: 15,
    textAlign: 'center',
  },

  button_container: {
    marginTop: 8,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    message: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
