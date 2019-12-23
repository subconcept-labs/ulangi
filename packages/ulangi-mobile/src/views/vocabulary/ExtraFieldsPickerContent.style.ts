/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface ExtraFieldsPickerContentStyles {
  picker_content: ViewStyle;
  row: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  description: TextStyle;
  name: TextStyle;
  btn_container: ViewStyle;
  btn: ViewStyle;
  btn_text: TextStyle;
  note: TextStyle;
}

export const baseStyles: ExtraFieldsPickerContentStyles = {
  picker_content: {},

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  left: {},

  right: {
    flexShrink: 1,
  },

  description: {},

  name: {
    fontSize: 15,
    fontWeight: '700',
  },

  btn_container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  btn: {
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.75,
    shadowOpacity: 0.15,
    elevation: 0.75,
  },

  btn_text: {},

  note: {
    fontSize: 12,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    row: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    description: {
      color: config.styles.light.secondaryTextColor,
    },

    name: {
      color: config.styles.light.primaryTextColor,
    },

    btn: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    btn_text: {
      color: config.styles.light.primaryTextColor,
    },

    note: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    row: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    description: {
      color: config.styles.dark.secondaryTextColor,
    },

    name: {
      color: config.styles.dark.primaryTextColor,
    },

    btn: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    btn_text: {
      color: config.styles.dark.primaryTextColor,
    },

    note: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
