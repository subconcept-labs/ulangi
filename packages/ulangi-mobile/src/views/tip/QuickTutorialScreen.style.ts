/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface QuickTutorialScreenStyles {
  screen: ViewStyle;
  carousel: ViewStyle;
  pagination: ViewStyle;
  button_container: ViewStyle;
  image_container: ViewStyle;
  image: ImageStyle;
  note: TextStyle;
}

export const baseStyles: QuickTutorialScreenStyles = {
  screen: {
    flex: 1,
    alignItems: 'center',
  },

  carousel: {
    alignItems: 'center',
  },

  pagination: {
    height: ss(50),
    paddingVertical: 0,
  },

  image_container: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ss(16),
  },

  image: {
    flexShrink: 1,
  },

  button_container: {
    paddingVertical: ss(12),
    justifyContent: 'center',
    alignItems: 'center',
  },

  note: {
    fontSize: ss(14),
    textAlign: 'center',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    note: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    note: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
