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

export interface SuggestionListStyles {
  title_container: ViewStyle;
  title: TextStyle;
  term: TextStyle;
  license_text: TextStyle;
  highlighted_text: TextStyle;
  bold: TextStyle;
}

export const baseStyles: SuggestionListStyles = {
  title_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  title: {
    fontSize: ss(14),
  },

  term: {
    fontWeight: 'bold',
  },

  license_text: {
    fontSize: ss(13),
  },

  highlighted_text: {
    color: config.styles.primaryColor,
  },

  bold: {
    fontWeight: 'bold',
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
