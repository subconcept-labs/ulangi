/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface LanguagePickerStyles {
  picker_container: ViewStyle;
  top_bar_container: ViewStyle;
  top_bar_text_container: ViewStyle;
  top_bar_text: TextStyle;
  close_button: ViewStyle;
  close_text: TextStyle;
  list_container: ViewStyle;
}

export const baseStyles: LanguagePickerStyles = {
  picker_container: {
    flex: 1,
    marginTop: 15,
  },

  top_bar_container: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  top_bar_text_container: {
    borderBottomWidth: 2,
    height: 44,
    justifyContent: 'center',
    marginBottom: -1,
  },

  top_bar_text: {
    paddingHorizontal: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },

  close_button: {
    height: 44,
    justifyContent: 'center',
    marginBottom: -1,
  },

  close_text: {
    paddingHorizontal: 16,
    color: config.styles.primaryColor,
    fontSize: 16,
  },

  list_container: {
    flex: 1,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    picker_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    top_bar_container: {
      borderBottomColor: config.styles.light.secondaryBackgroundColor,
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    top_bar_text_container: {
      borderBottomColor: '#000000',
    },

    top_bar_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    picker_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    top_bar_container: {
      borderBottomColor: config.styles.dark.secondaryBackgroundColor,
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
    },

    top_bar_text_container: {
      borderBottomColor: config.styles.primaryColor,
    },

    top_bar_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
