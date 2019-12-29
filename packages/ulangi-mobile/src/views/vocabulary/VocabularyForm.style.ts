/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface VocabularyFormStyles {
  form: ViewStyle;
  vocabulary_container: ViewStyle;
  vocabulary_input_container: ViewStyle;
  vocabulary_input: TextStyle;
  definition_container: ViewStyle;
  category_container: ViewStyle;
  category_name_container: ViewStyle;
  category_name: TextStyle;
  header: ViewStyle;
  left: ViewStyle;
  left_text: TextStyle;
  right: ViewStyle;
  button: ViewStyle;
  button_text: TextStyle;
  add_definition_btn_container: ViewStyle;
  add_definition_btn: ViewStyle;
  add_definition_btn_text: TextStyle;
}

export const baseStyles: VocabularyFormStyles = {
  form: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  vocabulary_container: {},

  vocabulary_input_container: {
    paddingHorizontal: 16,
  },

  vocabulary_input: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },

  definition_container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  category_container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  category_name_container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },

  category_name: {
    fontSize: 16,
  },

  header: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  left: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },

  left_text: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  right: {
    flexDirection: 'row',
    paddingRight: 8,
  },

  button: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  button_text: {
    fontSize: 12,
    fontWeight: '700',
    color: config.styles.primaryColor,
    letterSpacing: -0.25,
  },

  add_definition_btn_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  add_definition_btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  add_definition_btn_text: {
    paddingLeft: 4,
    fontSize: 12,
    fontWeight: '700',
    color: config.styles.primaryColor,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    form: {
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    vocabulary_input: {
      color: config.styles.light.primaryTextColor,
    },

    definition_container: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },

    category_container: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },

    category_name: {
      color: config.styles.light.primaryTextColor,
    },

    left_text: {
      color: config.styles.light.primaryTextColor,
    },

    add_definition_btn_container: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    form: {
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    vocabulary_input: {
      color: config.styles.dark.primaryTextColor,
    },

    definition_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },

    category_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },

    category_name: {
      color: config.styles.dark.primaryTextColor,
    },

    left_text: {
      color: config.styles.dark.primaryTextColor,
    },

    add_definition_btn_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
