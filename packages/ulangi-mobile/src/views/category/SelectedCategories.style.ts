/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SelectedCategoriesStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  category_name_list_container: ViewStyle;
  category_name: TextStyle;
}

export const baseStyles: SelectedCategoriesStyles = {
  container: {
    alignItems: 'center',
  },

  title_container: {},

  title: {
    fontSize: 13,
    fontWeight: '700',
    //opacity: 0.4,
  },

  category_name_list_container: {
    flexDirection: 'row',
    marginHorizontal: 50,
  },

  category_name: {
    paddingVertical: 5,
    //opacity: 0.3,
    fontSize: 14,
    fontWeight: '700',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.secondaryTextColor,
    },

    category_name: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.secondaryTextColor,
    },

    category_name: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
