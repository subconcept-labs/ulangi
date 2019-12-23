/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface ReviewActionBarStyles {
  container: ViewStyle;
  message: TextStyle;
  page: ViewStyle;
  action_btn: ViewStyle;
  icon_container: ViewStyle;
  action_title: TextStyle;
  action_subtitle: TextStyle;
}

export const baseStyles: ReviewActionBarStyles = {
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  message: {
    paddingTop: 7,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  page: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 3,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  action_btn: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
    paddingVertical: 5,
  },

  icon_container: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  action_title: {
    paddingTop: 6,
    paddingBottom: 2,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: -0.5,
  },

  action_subtitle: {
    textAlign: 'center',
    letterSpacing: -0.5,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderTopColor: config.styles.light.primaryBorderColor,
      borderBottomColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    message: {
      color: config.styles.light.secondaryTextColor,
    },

    action_title: {
      color: config.styles.light.primaryTextColor,
    },

    action_subtitle: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
      borderBottomColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    message: {
      color: config.styles.dark.secondaryTextColor,
    },

    action_title: {
      color: config.styles.dark.primaryTextColor,
    },

    action_subtitle: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
