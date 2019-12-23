/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface TopBarStyles {
  top_bar_container: ViewStyle;
}

export const baseStyles: TopBarStyles = {
  top_bar_container: {
    zIndex: 1,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    top_bar_container: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
      //borderBottomWidth: StyleSheet.hairlineWidth,
      //borderBottomColor: config.styles.light.primaryBorderColor,
      //shadowColor: '#000000',
      //shadowOffset: { width: 0, height: 0.5 },
      //shadowRadius: 0.5,
      //shadowOpacity: 0.05,
      //elevation: 0.75,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    top_bar_container: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
      //borderBottomWidth: Platform.OS === "android" ? StyleSheet.hairlineWidth : 0,
      //borderBottomColor: config.styles.dark.primaryBorderColor,
      //shadowColor: '#000000',
      //shadowOffset: { width: 0, height: 0.5 },
      //shadowRadius: 0.5,
      //shadowOpacity: 0.4,
      //elevation: 3,
    },
  }),
);
