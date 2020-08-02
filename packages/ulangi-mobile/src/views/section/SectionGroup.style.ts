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

export interface SectionGroupStyles {
  section_container: ViewStyle;
  header: TextStyle;
  item_container: ViewStyle;
}

export const baseStyles = StyleSheet.create({
  section_container: {
    marginBottom: ss(22),
  },

  header: {
    fontSize: ss(12),
    paddingHorizontal: ss(16),
    paddingBottom: ss(8),
  },

  item_container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    header: {
      color: config.styles.light.secondaryTextColor,
    },

    item_container: {
      borderTopColor: config.styles.light.primaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    header: {
      color: config.styles.dark.secondaryTextColor,
    },

    item_container: {
      borderTopColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
