/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface TranslationItemStyles {
  container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  vocabulary_text: TextStyle;
  button: ViewStyle;
  definition_list_container: ViewStyle;
  definition_container: ViewStyle;
  meaning_container: ViewStyle;
  meaning: TextStyle;
}

export const baseStyles: TranslationItemStyles = {
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },

  vocabulary_text_container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {},

  right: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vocabulary_text: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
  },

  button: {
    height: 30,
    width: 32,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    marginLeft: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.75,
    shadowOpacity: 0.15,
    elevation: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },

  definition_list_container: {},

  definition_container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: config.styles.light.primaryBorderColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  meaning_container: {
    flexShrink: 1,
    paddingVertical: 3,
  },

  meaning: {
    fontSize: 15,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    vocabulary_text: {
      color: config.styles.light.primaryTextColor,
    },

    button: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    add_text: {
      color: config.styles.light.primaryTextColor,
    },

    definition_container: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },

    meaning: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    vocabulary_text: {
      color: config.styles.dark.primaryTextColor,
    },

    button: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    add_text: {
      color: config.styles.dark.primaryTextColor,
    },

    definition_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },

    meaning: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
