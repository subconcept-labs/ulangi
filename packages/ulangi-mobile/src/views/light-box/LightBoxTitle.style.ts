/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface LightBoxTitleStyles {
  title_container: ViewStyle;
  title_text: TextStyle;
}

export const baseStyles = {
  title_container: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title_text: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: -0.25,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title_container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    title_text: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title_container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    title_text: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
