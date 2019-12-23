/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SetListStyles {
  empty_list_container: ViewStyle;
  empty_text: TextStyle;
  list_container: ViewStyle;
  list: ViewStyle;
}

export const baseStyles: SetListStyles = {
  empty_list_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  empty_text: {
    fontSize: 16,
  },

  list_container: {
    flex: 1,
  },

  list: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    empty_text: {
      color: config.styles.light.secondaryTextColor,
    },

    list: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    empty_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    list: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
