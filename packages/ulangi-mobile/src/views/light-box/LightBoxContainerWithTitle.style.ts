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

export interface LightBoxContainerWithTitleStyles {
  light_box_container: ViewStyle;
  inner_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
}

export const baseStyles: LightBoxContainerWithTitleStyles = {
  light_box_container: {
    justifyContent: 'center',
    paddingVertical: 150,
  },

  inner_container: {
    flexShrink: 1,
    borderRadius: ss(4),
    marginHorizontal: ss(16),
    overflow: 'hidden',
  },

  title_container: {
    alignSelf: 'stretch',
    paddingVertical: ss(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontWeight: 'bold',
    fontSize: ss(16),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    inner_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    title_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
    },

    title: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    inner_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    title_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    title: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
