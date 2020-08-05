/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface SetFormStyles {
  form_body_container: ViewStyle;
  set_name_container: ViewStyle;
  set_name_input: TextStyle;
  button_container: ViewStyle;
  button_touchable: ViewStyle;
  button_disabled: ViewStyle;
  button_text: TextStyle;
  button_text_disabled: TextStyle;
  bold: TextStyle;
}

export const baseStyles: SetFormStyles = StyleSheet.create({
  form_body_container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  set_name_container: {
    paddingHorizontal: ss(8),
  },

  set_name_input: {
    paddingVertical: ss(12),
    fontSize: ss(16),
    textAlign: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  button_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(6),
  },

  button_touchable: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: ss(3),
    paddingVertical: ss(10),
    paddingHorizontal: ss(12),
    marginVertical: ss(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  button_disabled: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: ss(3),
  },

  button_text: {
    fontSize: ss(15),
  },

  button_text_disabled: {},

  bold: {
    fontWeight: 'bold',
  },
});

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    form_body_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    set_name_input: {
      color: config.styles.light.primaryTextColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    button_touchable: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
      borderColor: config.styles.light.primaryBorderColor,
    },

    button_disabled: {
      backgroundColor: '#eee',
    },

    button_text: {
      color: config.styles.light.primaryTextColor,
    },

    button_text_disabled: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    form_body_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    set_name_input: {
      color: config.styles.dark.primaryTextColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    button_touchable: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
      borderColor: config.styles.dark.primaryBorderColor,
    },

    button_disabled: {
      backgroundColor: '#222',
    },

    button_text: {
      color: config.styles.dark.primaryTextColor,
    },

    button_text_disabled: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
