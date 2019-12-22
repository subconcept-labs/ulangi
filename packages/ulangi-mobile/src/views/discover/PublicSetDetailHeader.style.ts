/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface PublicSetDetailHeaderStyles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  author_containers: ViewStyle;
  author_container: ViewStyle;
  author_name_container: ViewStyle;
  author: TextStyle;
  link_icon_container: ViewStyle;
  link_icon: ImageStyle;
}

export const baseStyles: PublicSetDetailHeaderStyles = {
  container: {
    marginTop: 24,
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },

  author_containers: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  author_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  author_name_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  author: {
    fontSize: 13,
    textAlign: 'center',
  },

  link_icon_container: {
    marginLeft: 4,
  },

  link_icon: {},
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },

    subtitle: {
      color: config.styles.light.primaryTextColor,
    },

    author: {
      color: config.styles.light.secondaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },

    subtitle: {
      color: config.styles.dark.primaryTextColor,
    },

    author: {
      color: config.styles.dark.secondaryTextColor,
    },
  })
);
