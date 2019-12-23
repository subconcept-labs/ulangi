/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export interface ManageBarStyles {
  inner_container: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
}

export const baseStyle: ManageBarStyles = {
  inner_container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Shrink the button if set name is too long
    flexShrink: 1,
  },

  button_text: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: 14,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyle, {
    button_text: {
      color: '#888',
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyle, {
    button_text: {
      color: '#aaa',
    },
  }),
);
