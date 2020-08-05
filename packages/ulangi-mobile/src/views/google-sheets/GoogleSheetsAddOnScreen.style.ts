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

export interface GoogleSheetsAddOnScreenStyles {
  screen: ViewStyle;
  intro_container: ViewStyle;
  intro_text: TextStyle;
  tutorial_text: TextStyle;
  section_container: ViewStyle;
  password_input: TextStyle;
  api_key: TextStyle;
  expired_text: TextStyle;
  action_container: ViewStyle;
  primary_text: TextStyle;
  invalidate_text: TextStyle;
  dot: TextStyle;
  highlighted: TextStyle;
}

export const baseStyles: GoogleSheetsAddOnScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  intro_container: {
    paddingHorizontal: ss(16),
  },

  api_key: {
    fontSize: ss(15),
  },

  intro_text: {
    fontSize: ss(15),
  },

  tutorial_text: {
    paddingTop: ss(5),
    fontSize: ss(15),
  },

  section_container: {
    marginTop: ss(16),
  },

  password_input: {
    flex: 1,
  },

  expired_text: {},

  action_container: {
    marginTop: ss(4),
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
    paddingHorizontal: ss(8),
    fontSize: ss(17),
  },

  highlighted: {
    color: config.styles.primaryColor,
  },
});

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    intro_text: {
      color: config.styles.light.primaryTextColor,
    },

    api_key: {
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

    api_key: {
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
