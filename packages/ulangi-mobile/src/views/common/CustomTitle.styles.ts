/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export interface CustomTitleStyles {
  title_container: ViewStyle;
  title: TextStyle;
  subtitle_container: ViewStyle;
  subtitle: TextStyle;
}

export const baseStyles: CustomTitleStyles = {
  title_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 19,
    flexShrink: 1,
  },

  subtitle_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  subtitle: {
    color: '#fff',
    fontSize: 13,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: '#777',
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: '#ececec',
    },
  })
);
