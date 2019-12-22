/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface ReviewFeedbackItemStyles {
  vocabulary_container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  vocabulary_text: TextStyle;
  level_net_change: TextStyle;
  row_container: ViewStyle;
  left_container: ViewStyle;
  left_text: TextStyle;
  right_container: ViewStyle;
  flex_row: ViewStyle;
  right_text: TextStyle;
}

export const baseStyles: ReviewFeedbackItemStyles = {
  vocabulary_container: {
    marginHorizontal: 16,
    borderRadius: 3,
    marginTop: 20,
  },

  vocabulary_text_container: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  vocabulary_text: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  level_net_change: {
    paddingLeft: 10,
  },

  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: 1,
  },

  left_container: {
    flex: 1,
    justifyContent: 'center',
  },

  left_text: {
    fontSize: 15,
  },

  right_container: {
    flex: 1,
  },

  flex_row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  right_text: {
    fontSize: 15,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    vocabulary_container: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    vocabulary_text: {
      color: config.styles.light.primaryTextColor,
    },

    row_container: {
      borderTopColor: config.styles.light.primaryBackgroundColor,
    },

    left_text: {
      color: config.styles.light.secondaryTextColor,
    },

    right_text: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    vocabulary_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    vocabulary_text: {
      color: config.styles.dark.primaryTextColor,
    },

    row_container: {
      borderTopColor: config.styles.dark.secondaryBackgroundColor,
    },

    left_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    right_text: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
