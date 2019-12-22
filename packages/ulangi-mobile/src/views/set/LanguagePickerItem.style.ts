/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface LanguagePickerItemStyles {
  item_container: ViewStyle;
  touchable: ViewStyle;
  select_icon: ImageStyle;
  flag_icon: ImageStyle;
  text_container: ViewStyle;
  item_text: TextStyle;
  item_note: TextStyle;
}

export const baseStyles: LanguagePickerItemStyles = {
  item_container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: -1,
    marginHorizontal: 8,
  },

  touchable: {
    paddingVertical: 15,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  select_icon: {
    marginRight: 10,
  },

  flag_icon: {
    marginRight: 6,
  },

  text_container: {
    flexShrink: 1,
  },

  item_text: {
    fontSize: 15,
  },

  item_note: {
    fontSize: 13,
    color: 'orange',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
      borderBottomColor: config.styles.light.secondaryBorderColor,
    },

    item_text: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
      borderBottomColor: config.styles.dark.secondaryBorderColor,
    },

    item_text: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
