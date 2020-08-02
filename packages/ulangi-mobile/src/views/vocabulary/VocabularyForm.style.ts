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
  button_blue: ViewStyle;
  button_text: TextStyle;
  button_red_text: TextStyle;
  button_green_text: TextStyle;
  button_blue_text: TextStyle;
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
    paddingHorizontal: ss(16),
  },

  vocabulary_input: {
    paddingHorizontal: ss(0),
    paddingVertical: ss(16),
    fontSize: ss(16),
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
    paddingBottom: ss(16),
    paddingHorizontal: ss(16),
  },

  category_name: {
    //paddingTop: 8,
    flex: 1,
    flexWrap: 'wrap',
    fontSize: ss(16),
  },

  header: {
    flexDirection: 'row',
    marginVertical: ss(5),
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title_container: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: ss(16),
    paddingTop: ss(8),
  },

  title: {
    fontSize: ss(16),
    fontWeight: 'bold',
  },

  title_button_container: {
    paddingHorizontal: ss(12),
  },

  button_list: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: ss(12),
    paddingBottom: ss(12),
  },

  button: {
    marginHorizontal: ss(4),
    paddingHorizontal: ss(8),
    paddingVertical: ss(7),
    backgroundColor: '#E0E0E0',
    borderRadius: ss(3),
  },

  button_green: {
    backgroundColor: '#C5E1A5',
  },

  button_blue: {
    backgroundColor: '#81D4FA',
  },

  button_red: {
    backgroundColor: '#FFCDD2',
  },

  button_text: {
    fontSize: ss(11),
    fontWeight: '700',
    color: '#424242',
    letterSpacing: ss(-0.5),
  },

  button_red_text: {
    color: '#C62828',
  },

  button_green_text: {
    color: '#33691E',
  },

  button_blue_text: {
    color: '#01579B',
  },

  add_definition_btn_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: ss(12),
    paddingVertical: ss(10),
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  add_definition_btn: {
    flex: 1,
    paddingVertical: ss(9),
    paddingHorizontal: ss(10),
    marginHorizontal: ss(4),
  },

  add_definition_btn_text: {
    fontSize: ss(12),
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
