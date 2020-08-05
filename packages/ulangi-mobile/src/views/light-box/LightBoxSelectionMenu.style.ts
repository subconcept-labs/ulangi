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

export interface LightBoxSelectionMenuStyles {
  selection_menu_container: ViewStyle;
  light_box_top_bar: ViewStyle;
  button_container: ViewStyle;
  button_left: ViewStyle;
  button_right: ViewStyle;
  title_text: TextStyle;
  list_container: ViewStyle;
}

export const baseStyles: LightBoxSelectionMenuStyles = {
  selection_menu_container: {
    flexShrink: 1,
    marginVertical: ss(16),
    borderRadius: ss(4),
  },

  light_box_top_bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ss(50),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  button_container: {
    flex: 1,
    flexDirection: 'row',
  },

  button_left: {
    justifyContent: 'flex-start',
  },

  button_right: {
    justifyContent: 'flex-end',
  },

  title_text: {
    fontSize: ss(16),
    fontWeight: 'bold',
  },

  list_container: {},
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    selection_menu_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    light_box_top_bar: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    title_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    selection_menu_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    light_box_top_bar: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    title_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
