/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SpacedRepetitionResultStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title: TextStyle;
  view_all_feedback_button_container: ViewStyle;
  save_text: TextStyle;
  ad_notice_container: ViewStyle;
  button_container: ViewStyle;
}

export const baseStyles: SpacedRepetitionResultStyles = {
  container: {
    flex: 1,
  },

  title_container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  view_all_feedback_button_container: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  save_text: {
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 6,
    lineHeight: 19,
  },

  ad_notice_container: {
    marginTop: 16,
    marginHorizontal: 16,
  },

  button_container: {
    marginTop: 16,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.light.primaryTextColor,
    },

    save_text: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryTextColor,
    },

    save_text: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
