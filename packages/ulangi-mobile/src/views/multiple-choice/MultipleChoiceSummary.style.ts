/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface MultipleChoiceSummaryStyles {
  stats_container: ViewStyle;
  result_container: ViewStyle;
  result_row: ViewStyle;
  percentage: TextStyle;
  grade: TextStyle;
  row: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  text_left: TextStyle;
  text_right: TextStyle;
  text_highlight: TextStyle;
  text_touchable: ViewStyle;
  horizontal_line: ViewStyle;
}

export const baseStyles: MultipleChoiceSummaryStyles = {
  stats_container: {
    marginTop: 12,
    marginBottom: 12,
  },

  result_container: {
    marginHorizontal: 16,
  },

  result_row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 2,
  },

  percentage: {
    fontWeight: 'bold',
  },

  grade: {
    fontWeight: 'bold',
  },

  row: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexShrink: 1,
    paddingRight: 16,
  },

  right: {},

  text_left: {
    fontSize: 14,
  },

  text_right: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  text_highlight: {
    color: config.styles.primaryColor,
  },

  text_touchable: {},

  horizontal_line: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 16,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    percentage: {
      color: config.styles.light.secondaryTextColor,
    },

    grade: {
      color: config.styles.light.primaryTextColor,
    },

    text_left: {
      color: config.styles.light.secondaryTextColor,
    },

    text_right: {
      color: config.styles.light.primaryTextColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.light.primaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    percentage: {
      color: config.styles.dark.secondaryTextColor,
    },

    grade: {
      color: config.styles.dark.primaryTextColor,
    },

    text_left: {
      color: config.styles.dark.secondaryTextColor,
    },

    text_right: {
      color: config.styles.dark.primaryTextColor,
    },

    horizontal_line: {
      backgroundColor: config.styles.dark.primaryBorderColor,
    },
  }),
);
