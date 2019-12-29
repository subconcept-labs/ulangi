/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface GoogleSheetsAddOnScreenStyles {
  screen: ViewStyle;
  intro_container: ViewStyle;
  intro_text: TextStyle;
  tutorial_text: TextStyle;
  section_container: ViewStyle;
  password_input: TextStyle;
  expired_text: TextStyle;
  action_container: ViewStyle;
  primary_text: TextStyle;
  invalidate_text: TextStyle;
  dot: TextStyle;
}

export const baseStyles: GoogleSheetsAddOnScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  intro_container: {
    paddingHorizontal: 16,
  },

  intro_text: {
    fontSize: 15,
  },

  tutorial_text: {
    paddingTop: 5,
    fontSize: 15,
  },

  section_container: {
    marginTop: 16,
  },

  password_input: {
    flex: 1,
  },

  expired_text: {},

  action_container: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  primary_text: {
    color: config.styles.primaryColor,
  },

  invalidate_text: {
    color: 'orangered',
  },

  dot: {
    paddingHorizontal: 8,
    fontSize: 17,
  },
});

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    intro_text: {
      color: config.styles.light.primaryTextColor,
    },

    expired_text: {
      color: config.styles.light.secondaryTextColor,
    },

    dot: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    intro_text: {
      color: config.styles.dark.primaryTextColor,
    },

    expired_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    dot: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
