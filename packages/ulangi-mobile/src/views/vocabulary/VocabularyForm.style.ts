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
  title_container: ViewStyle;
  title: TextStyle;
  title_button_container: ViewStyle;
  button_list: ViewStyle;
  button: ViewStyle;
  button_red: ViewStyle;
  button_green: ViewStyle;
  button_text: TextStyle;
  button_red_text: TextStyle;
  button_green_text: TextStyle;
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
    paddingVertical: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },

  category_name: {
    //paddingTop: 8,
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 16,
  },

  header: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title_container: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingTop: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  title_button_container: {
    paddingHorizontal: 12,
  },

  button_list: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  button: {
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },

  button_green: {
    backgroundColor: '#C5E1A5',
  },

  button_red: {
    backgroundColor: '#FFCDD2',
  },

  button_text: {
    fontSize: 11,
    fontWeight: '700',
    color: '#424242',
    letterSpacing: -0.25,
  },

  button_red_text: {
    color: '#C62828',
  },

  button_green_text: {
    color: '#33691E',
  },

  add_definition_btn_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  add_definition_btn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },

  add_definition_btn_text: {
    fontSize: 12,
    textAlign: 'center',
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

    title: {
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

    title: {
      color: config.styles.dark.primaryTextColor,
    },

    add_definition_btn_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
