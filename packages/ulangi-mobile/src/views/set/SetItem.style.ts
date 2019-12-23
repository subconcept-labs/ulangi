/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SetItemStyles {
  cell_container: ViewStyle;
  icon_container: ViewStyle;
  flag_icon: ImageStyle;
  content_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  set_name_container: ViewStyle;
  set_name: TextStyle;
  option_touchable: ViewStyle;
  meta_container: ViewStyle;
  meta_text: TextStyle;
  language: ViewStyle;
  dot: TextStyle;
  current_text: TextStyle;
}

export const baseStyles: SetItemStyles = {
  cell_container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  icon_container: {
    paddingRight: 12,
  },

  flag_icon: {},

  content_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexShrink: 1,
  },

  right: {},

  set_name_container: {
    paddingTop: 14,
    paddingBottom: 4,
  },

  set_name: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  option_touchable: {},

  meta_container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingBottom: 14,
  },

  meta_text: {
    fontSize: 14,
  },

  language: {},

  dot: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  current_text: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: 'coral',
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    cell_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    set_name: {
      color: config.styles.light.primaryTextColor,
    },

    meta_text: {
      color: config.styles.light.secondaryTextColor,
    },

    dot: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    cell_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    set_name: {
      color: config.styles.dark.primaryTextColor,
    },

    meta_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    dot: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
