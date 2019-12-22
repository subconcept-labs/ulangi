/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DefinitionListStyles {
  definition_list: ViewStyle;
  missing_definitions_container: ViewStyle;
  missing_definitions: TextStyle;
}

export const baseStyles: DefinitionListStyles = {
  definition_list: {},

  missing_definitions_container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  missing_definitions: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#777',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    missing_definitions_container: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },

    missing_definitions: {
      color: config.styles.light.secondaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    missing_definitions_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },

    missing_definitions: {
      color: config.styles.dark.secondaryTextColor,
    },
  })
);
