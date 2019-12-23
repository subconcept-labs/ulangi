/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SectionRowStyles {
  outer_container: ViewStyle;
  inner_container: ViewStyle;
  row_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  left_text: TextStyle;
  right_text: TextStyle;
  caret: ImageStyle;
  description_container: ViewStyle;
  description_text: TextStyle;
  disabled_container: ViewStyle;
  disabled_left_text: TextStyle;
}

export const baseStyles: SectionRowStyles = StyleSheet.create({
  outer_container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  inner_container: {
    paddingVertical: 3,
  },

  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  left_text: {
    fontSize: 15,
  },

  right_text: {
    fontSize: 15,
  },

  caret: {
    marginLeft: 8,
  },

  description_container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },

  description_text: {
    fontSize: 15,
    lineHeight: 19,
  },

  disabled_container: {},

  disabled_left_text: {},
});

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    outer_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    left_text: {
      color: config.styles.light.primaryTextColor,
    },

    right_text: {
      color: config.styles.light.secondaryTextColor,
    },

    description_text: {
      color: config.styles.light.secondaryTextColor,
    },

    disabled_container: {
      backgroundColor: '#ddd',
    },

    disabled_left_text: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    outer_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    left_text: {
      color: config.styles.dark.primaryTextColor,
    },

    right_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    description_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    disabled_container: {
      backgroundColor: '#363636',
    },

    disabled_left_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
