/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface PublicSetDetailHeaderStyles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  attribution_containers: ViewStyle;
  attribution_container: ViewStyle;
  attribution: TextStyle;
  highlighted: TextStyle;
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

  attribution_containers: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  attribution_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  attribution: {
    fontSize: 13,
    textAlign: 'center',
  },

  highlighted: {
    color: config.styles.primaryColor,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },

    subtitle: {
      color: config.styles.light.primaryTextColor,
    },

    attribution: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },

    subtitle: {
      color: config.styles.dark.primaryTextColor,
    },

    attribution: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
