/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface FollowUsScreenStyles {
  screen: ViewStyle;
  intro_container: ViewStyle;
  intro_text: TextStyle;
  section_container: ViewStyle;
}

export const baseStyles: FollowUsScreenStyles = {
  screen: {
    flex: 1,
  },

  intro_container: {
    paddingHorizontal: 16,
  },

  intro_text: {
    fontSize: 15,
  },

  section_container: {
    marginTop: 16,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    intro_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    intro_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
