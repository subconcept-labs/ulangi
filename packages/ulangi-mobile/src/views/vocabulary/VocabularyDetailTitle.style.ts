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

export interface VocabularyDetailTitleStyles {
  container: ViewStyle;
  vocabulary_text: TextStyle;
}

export const baseStyles: VocabularyDetailTitleStyles = StyleSheet.create({
  container: {
    paddingHorizontal: ss(16),
    paddingTop: ss(26),
    paddingBottom: ss(8),
  },

  vocabulary_text: {
    fontSize: ss(25),
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    vocabulary_text: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    vocabulary_text: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
