/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface LightBoxDialogStyles {
  dialog_container: ViewStyle;
}

export const baseStyles: LightBoxDialogStyles = {
  dialog_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 3,
    margin: 16,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    dialog_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    dialog_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },
  }),
);
