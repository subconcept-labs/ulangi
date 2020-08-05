/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ls, ss } from '../../utils/responsive';

export interface TranslationItemStyles {
  outer_container: ViewStyle;
  inner_container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  vocabulary_text: TextStyle;
  button: ViewStyle;
  definition_list_container: ViewStyle;
  definition_container: ViewStyle;
  meaning_container: ViewStyle;
  meaning: TextStyle;
  attribution_container: ViewStyle;
}

export const baseStyles: TranslationItemStyles = {
  outer_container: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.3 },
    shadowRadius: 0.75,
    shadowOpacity: 0.25,
  },

  inner_container: {
    marginHorizontal: ls(16),
    marginTop: ss(16),
    borderRadius: ss(5),
    overflow: 'hidden',
    elevation: 2,
  },

  vocabulary_text_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {},

  right: {
    marginLeft: ss(8),
    flexDirection: 'row',
    alignItems: 'center',
  },

  vocabulary_text: {
    fontWeight: 'bold',
    fontSize: ss(19),
    lineHeight: ss(20),
  },

  button: {
    height: ss(30),
    width: ss(32),
    borderRadius: ss(3),
    borderWidth: 1,
    marginLeft: ss(7),
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
    paddingHorizontal: ss(16),
    paddingVertical: ss(8),
    flexDirection: 'row',
    alignItems: 'center',
  },

  meaning_container: {
    flexShrink: 1,
    paddingVertical: ss(3),
  },

  meaning: {
    fontSize: ss(17),
  },

  attribution_container: {
    paddingVertical: ss(13),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: ss(16),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    inner_container: {
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

    definition_list_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },

    definition_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },

    meaning: {
      color: config.styles.light.primaryTextColor,
    },

    attribution_container: {
      backgroundColor: config.styles.light.tertiaryBackgroundColor,
      borderTopColor: config.styles.light.secondaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    inner_container: {
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

    definition_list_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },

    definition_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },

    meaning: {
      color: config.styles.dark.primaryTextColor,
    },

    attribution_container: {
      backgroundColor: config.styles.dark.tertiaryBackgroundColor,
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },
  }),
);
