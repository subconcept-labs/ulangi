/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DictionaryDefinitionListStyles {
  title_container: ViewStyle;
  title: TextStyle;
  term: TextStyle;
  license_text: TextStyle;
  hightlighted: TextStyle;
}

export const baseStyles: DictionaryDefinitionListStyles = {
  title_container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  title: {
    fontSize: 14,
  },

  term: {
    fontWeight: 'bold',
  },

  license_text: {
    fontSize: 13,
  },

  hightlighted: {
    color: config.styles.primaryColor,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title_container: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    title: {
      color: config.styles.light.secondaryTextColor,
    },

    term: {
      color: config.styles.light.primaryTextColor,
    },

    license_text: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title_container: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    title: {
      color: config.styles.dark.secondaryTextColor,
    },

    term: {
      color: config.styles.dark.primaryTextColor,
    },

    license_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
