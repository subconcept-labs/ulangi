/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface WhatToUseScreenStyles {
  screen: ViewStyle;
  scroll_view_container: ViewStyle;
  content_container: ViewStyle;
  paragraph: ViewStyle;
  title: TextStyle;
  text: TextStyle;
  bold: TextStyle;
  highlighted: TextStyle;
}

export const baseStyles: WhatToUseScreenStyles = {
  screen: {
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  scroll_view_container: {
    flex: 1,
  },

  content_container: {
    paddingHorizontal: 16,
  },

  paragraph: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 19,
  },

  text: {
    fontSize: 15,
    paddingVertical: 6,
    lineHeight: 19,
  },

  bold: {
    fontWeight: '700',
  },

  highlighted: {
    color: config.styles.primaryColor,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    screen: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },

    paragraph: {
      borderBottomColor: config.styles.light.primaryBorderColor,
    },

    title: {
      color: config.styles.light.secondaryTextColor,
    },

    text: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    screen: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },

    paragraph: {
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },

    title: {
      color: config.styles.dark.secondaryTextColor,
    },

    text: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
