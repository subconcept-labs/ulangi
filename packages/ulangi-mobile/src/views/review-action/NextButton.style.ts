/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface NextButtonStyles {
  container: ViewStyle;
  next_button_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
}

export const baseStyles: NextButtonStyles = {
  container: {},

  next_button_container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  title_container: {
    paddingVertical: 10,
  },

  title: {
    textAlign: 'center',
    fontSize: 14,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },

    subtitle: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },

    subtitle: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
