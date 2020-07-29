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
  outer_container: ViewStyle;
  inner_container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  top_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  vocabulary_text: TextStyle;
  definition_list_container: ViewStyle;
  definition_container: ViewStyle;
  meaning_container: ViewStyle;
  plain_meaning_container: ViewStyle;
  plain_meaning: TextStyle;
  attribution_container: ViewStyle;
  attribution: TextStyle;
  highlighted: TextStyle;
  dot_container: ViewStyle;
  dot: TextStyle;
  button: ViewStyle;
}

export const baseStyles: PublicVocabularyItemStyles = {
  outer_container: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.3 },
    shadowRadius: 0.75,
    shadowOpacity: 0.25,
  },

  inner_container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 2,
  },

  vocabulary_text_container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  top_container: {
    paddingVertical: 2,
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
    fontSize: 19,
    color: config.styles.primaryColor,
  },

  button: {
    height: 30,
    width: 32,
    borderRadius: 3,
    borderWidth: 1,
    marginLeft: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.75,
    shadowOpacity: 0.15,
    elevation: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },

  definition_list_container: {
    borderTopWidth: 2,
  },

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
    fontSize: 17,
  },

  attribution_container: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },

  attribution: {
    fontSize: 12,
  },

  highlighted: {
    color: config.styles.primaryColor,
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
    inner_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    button: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    definition_list_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },

    definition_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },

    plain_meaning: {
      color: config.styles.light.primaryTextColor,
    },

    attribution_container: {
      backgroundColor: config.styles.light.tertiaryBackgroundColor,
      borderTopColor: config.styles.light.secondaryBorderColor,
    },

    attribution: {
      color: config.styles.light.secondaryTextColor,
    },

    dot: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    inner_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    button: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    definition_list_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },

    definition_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },

    plain_meaning: {
      color: config.styles.dark.primaryTextColor,
    },

    attribution_container: {
      backgroundColor: config.styles.dark.tertiaryBackgroundColor,
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },

    attribution: {
      color: config.styles.dark.secondaryTextColor,
    },

    dot: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
