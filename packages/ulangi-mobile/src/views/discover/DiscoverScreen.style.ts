/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DiscoverScreenStyles {
  screen: ViewStyle;
  top_container: ViewStyle;
  message_container: ViewStyle;
  message: TextStyle;
  floating_button_container: ViewStyle;
  header_text: TextStyle;
  highlighted: TextStyle;
}

export const baseStyles: DiscoverScreenStyles = {
  screen: {
    flex: 1,
  },

  top_container: {
    borderBottomWidth: 1,
  },

  message_container: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    color: '#888',
    fontSize: 15,
  },

  floating_button_container: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },

  header_text: {
    paddingVertical: 20,
    paddingHorizontal: 50,
    fontSize: 15,
    textAlign: 'center',
  },

  highlighted: {
    color: config.styles.primaryColor,
    fontWeight: 'bold',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    top_container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    header_text: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    top_container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    screen: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#131313',
    },

    header_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
