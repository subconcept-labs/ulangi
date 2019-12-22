/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DefinitionExtraFieldListStyles {
  container: ViewStyle;
  field_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  name: TextStyle;
  image_list: ViewStyle;
  image_container: ViewStyle;
  image: ViewStyle;
  value: TextStyle;
}

export const baseStyles: DefinitionExtraFieldListStyles = {
  container: {
    marginHorizontal: 16,
  },

  field_container: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {},

  right: {},

  name: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  image_list: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: -8,
  },

  image_container: {
    paddingHorizontal: 8,
  },

  image: {
    backgroundColor: '#e3e3e3',
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },

  value: {
    fontSize: 15,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    name: {
      color: config.styles.light.secondaryTextColor,
    },

    image: {
      backgroundColor: '#e3e3e3',
    },

    value: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    name: {
      color: config.styles.dark.secondaryTextColor,
    },

    image: {
      backgroundColor: '#e3e3e3',
    },

    value: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
