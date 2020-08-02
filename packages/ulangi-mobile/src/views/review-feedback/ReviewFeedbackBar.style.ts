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

export interface ReviewFeedbackBarStyles {
  container: ViewStyle;
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

  title_container: {
    paddingVertical: ss(10),
  },

  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ss(15),
  },

  subtitle: {
    textAlign: 'center',
    fontSize: ss(14),
  },

  feedback_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ss(3),
    paddingBottom: ss(14),
  },

  feedback_btn: {
    flex: 1,
    borderRadius: ss(6),
    marginHorizontal: ss(3),
    paddingVertical: ss(7),
  },

  feedback_text: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: ss(11),
    letterSpacing: ss(-0.5),
    color: '#f7f7f7',
  },

  time_text: {
    textAlign: 'center',
    fontSize: ss(13),
    fontWeight: '700',
    color: '#f7f7f7',
  },

  level_text: {
    textAlign: 'center',
    fontSize: ss(13),
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
