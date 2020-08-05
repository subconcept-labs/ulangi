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

export interface ReviewStrokeOrderStyles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  button_text: TextStyle;
}

export const baseStyles: ReviewStrokeOrderStyles = {
  container: {
    paddingHorizontal: ss(16),
    marginTop: ss(10),
  },

  title: {
    fontSize: ss(15),
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: ss(15),
  },

  button_text: {
    fontSize: ss(15),
    color: config.styles.primaryColor,
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
