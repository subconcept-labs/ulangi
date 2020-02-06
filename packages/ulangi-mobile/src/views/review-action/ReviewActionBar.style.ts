/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface ReviewActionBarStyles {
  container: ViewStyle;
  action_btn: ViewStyle;
  icon_container: ViewStyle;
  title_container: ViewStyle;
  action_title: TextStyle;
  action_subtitle: TextStyle;
}

export const baseStyles: ReviewActionBarStyles = {
  container: {},

  action_btn: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    maxWidth: 150,
    alignItems: 'center',
    paddingVertical: 12,
    overflow: 'hidden',
  },

  icon_container: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title_container: {
    flexShrink: 1,
    marginLeft: 6,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },

  action_title: {
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: -0.5,
  },

  action_subtitle: {
    letterSpacing: -0.5,
    fontSize: 11,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
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
    action_title: {
      color: config.styles.dark.primaryTextColor,
    },

    action_subtitle: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
