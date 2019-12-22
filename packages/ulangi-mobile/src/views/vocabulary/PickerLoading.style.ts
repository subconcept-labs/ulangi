/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface PickerLoadingStyles {
  spinner_container: ViewStyle;
  spinner: ViewStyle;
  spinner_text: TextStyle;
}

export const baseStyles: PickerLoadingStyles = {
  spinner_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },

  spinner: {
    marginRight: 5,
  },

  spinner_text: {
    fontSize: 14,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    spinner_container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    spinner_text: {
      color: config.styles.light.secondaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    spinner_container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    spinner_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  })
);
