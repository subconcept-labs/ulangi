/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface ReviewFeedbackBarStyles {
  container: ViewStyle;
  show_answer_button_container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  feedback_container: ViewStyle;
  feedback_btn: ViewStyle;
  feedback_text: TextStyle;
  time_text: TextStyle;
  level_text: TextStyle;
}

export const baseStyles: ReviewFeedbackBarStyles = {
  container: {},

  show_answer_button_container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  title_container: {
    paddingVertical: 10,
  },

  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },

  feedback_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingBottom: 14,
  },

  feedback_btn: {
    flex: 1,
    borderRadius: 6,
    marginHorizontal: 3,
    paddingVertical: 7,
  },

  feedback_text: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: -0.5,
    color: '#f7f7f7',
  },

  time_text: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#f7f7f7',
  },

  level_text: {
    textAlign: 'center',
    fontSize: 13,
    color: '#fff',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },

    subtitle: {
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
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
