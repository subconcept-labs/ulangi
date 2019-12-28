/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SpacedRepetitionTitleStyles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  icon: ImageStyle;
}

export const baseStyles: SpacedRepetitionTitleStyles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontFamily: 'JosefinSans-Bold',
    letterSpacing: -0.5,
  },

  subtitle: {
    paddingTop: 4,
    fontSize: 9,
    fontFamily: 'JosefinSans-Bold',
    letterSpacing: 0.5,
  },

  icon: {
    marginTop: 10,
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
