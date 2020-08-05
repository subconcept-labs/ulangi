/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface PublicVocabularyListHeaderStyles {
  header_container: ViewStyle;
  term_count_container: ViewStyle;
  term_count: TextStyle;
  add_all_btn: ViewStyle;
  add_all_plus: ImageStyle;
  add_all_text: TextStyle;
}

export const baseStyles: PublicVocabularyListHeaderStyles = {
  header_container: {
    marginHorizontal: ss(16),
    marginBottom: ss(2),
    paddingBottom: ss(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  term_count_container: {},

  term_count: {
    fontSize: ss(14),
  },

  add_all_btn: {
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: ss(8),
    paddingVertical: ss(6),
    marginLeft: ss(7),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.75,
    shadowOpacity: 0.15,
    elevation: 0.75,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  add_all_plus: {
    marginRight: ss(3),
  },

  add_all_text: {
    fontSize: ss(13),
    fontWeight: 'bold',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    header_container: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    term_count: {
      color: config.styles.light.secondaryTextColor,
    },

    add_all_btn: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    add_all_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    header_container: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    term_count: {
      color: config.styles.dark.secondaryTextColor,
    },

    add_all_btn: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    add_all_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
