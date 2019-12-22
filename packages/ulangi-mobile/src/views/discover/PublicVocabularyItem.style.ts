/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface PublicVocabularyItemStyles {
  container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  vocabulary_text: TextStyle;
  definition_list_container: ViewStyle;
  definition_container: ViewStyle;
  meaning_container: ViewStyle;
  plain_meaning_container: ViewStyle;
  plain_meaning: TextStyle;
  source_list: ViewStyle;
  source_container: ViewStyle;
  source: TextStyle;
  dot_container: ViewStyle;
  dot: TextStyle;
  button: ViewStyle;
}

export const baseStyles: PublicVocabularyItemStyles = {
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
  },

  meaning_container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  plain_meaning_container: {
    flexShrink: 1,
    paddingVertical: 3,
  },

  plain_meaning: {
    fontSize: 15,
  },

  source_list: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },

  source_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  source: {
    fontSize: 12,
  },

  dot_container: {
    paddingHorizontal: 6,
  },

  dot: {
    fontSize: 17,
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

    definition_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },

    plain_meaning: {
      color: config.styles.light.primaryTextColor,
    },

    source: {
      color: config.styles.light.secondaryTextColor,
    },

    dot: {
      color: config.styles.light.secondaryTextColor,
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

    definition_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },

    plain_meaning: {
      color: config.styles.dark.primaryTextColor,
    },

    source: {
      color: config.styles.dark.secondaryTextColor,
    },

    dot: {
      color: config.styles.dark.secondaryTextColor,
    },
  })
);
