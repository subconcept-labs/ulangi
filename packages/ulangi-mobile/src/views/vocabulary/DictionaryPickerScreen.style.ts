/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DictionaryPickerScreenStyles {
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
  picker_header: ViewStyle;
  header_item_left: ViewStyle;
  header_text_left: TextStyle;
  header_item_right: ViewStyle;
  header_text_right: TextStyle;
  picker_content_container: ViewStyle;
}

export const baseStyles: DictionaryPickerScreenStyles = {
  light_box_container: {
    justifyContent: 'flex-end',
  },

  inner_container: {
    alignSelf: 'stretch',
    overflow: 'hidden',
  },

  picker_header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  header_item_left: {
    justifyContent: 'center',
    borderBottomWidth: 2,
    marginBottom: -1,
    height: 44,
  },

  header_text_left: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
    fontSize: 16,
  },

  header_item_right: {},

  header_text_right: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: config.styles.primaryColor,
  },

  picker_content_container: {
    height: Dimensions.get('window').height / 2,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    picker_header: {
      borderBottomColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    header_item_left: {
      borderBottomColor: config.styles.light.primaryTextColor,
    },

    header_text_left: {
      color: config.styles.light.primaryTextColor,
    },

    picker_content_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    picker_header: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
    },

    header_item_left: {
      borderBottomColor: config.styles.primaryColor,
    },

    header_text_left: {
      color: config.styles.dark.primaryTextColor,
    },

    picker_content_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },
  }),
);
