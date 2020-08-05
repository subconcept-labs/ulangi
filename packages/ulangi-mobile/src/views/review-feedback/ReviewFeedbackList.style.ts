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

export interface ReviewFeedbackListStyles {
  header: ViewStyle;
  header_text: TextStyle;
  list_content_container: ViewStyle;
  bold: TextStyle;
}

export const baseStyles: ReviewFeedbackListStyles = {
  header: {
    paddingHorizontal: ss(16),
    paddingTop: ss(16),
  },

  header_text: {
    fontSize: ss(14),
    textAlign: 'center',
  },

  list_content_container: {
    paddingBottom: ss(16),
  },

  bold: {
    fontWeight: '700',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    header_text: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    header_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
