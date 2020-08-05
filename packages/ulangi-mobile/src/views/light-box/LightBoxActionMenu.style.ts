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

export interface LightBoxActionMenuStyles {
  action_menu_container: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
  list_container: ViewStyle;
}

export const baseStyles: LightBoxActionMenuStyles = {
  action_menu_container: {
    flexShrink: 1,
    marginVertical: ss(16),
    borderRadius: ss(4),
  },

  title_container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ss(16),
    height: ss(50),
  },

  title_text: {
    fontWeight: 'bold',
    fontSize: ss(16),
  },

  list_container: {},
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    action_menu_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    title_container: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    title_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    action_menu_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    title_container: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    title_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
