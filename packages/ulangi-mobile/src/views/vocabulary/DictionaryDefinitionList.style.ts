/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DictionaryDefinitionListStyles {
  source_container: ViewStyle;
  source_left: ViewStyle;
  source_text: TextStyle;
  license_text: TextStyle;
  link_container: ViewStyle;
  link_icon: ImageStyle;
}

export const baseStyles: DictionaryDefinitionListStyles = {
  source_container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  source_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  source_text: {
    fontSize: 14,
  },

  license_text: {
    fontSize: 13,
  },

  link_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  link_icon: {
    marginLeft: 2,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    source_container: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    source_text: {
      color: config.styles.light.primaryTextColor,
    },

    license_text: {
      color: config.styles.light.secondaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    source_container: {
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    source_text: {
      color: config.styles.dark.primaryTextColor,
    },

    license_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  })
);
