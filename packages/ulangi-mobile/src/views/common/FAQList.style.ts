/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface FAQListStyles {
  container: ViewStyle;
  scroll_view: ViewStyle;
  section_container: ViewStyle;
  header_container: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
  content_container: ViewStyle;
  content_text: TextStyle;
  index_container: ViewStyle;
  index: TextStyle;
}

export const baseStyles: FAQListStyles = {
  container: {
    flex: 1,
  },

  scroll_view: {
    paddingVertical: 8,
  },

  section_container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  header_container: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },

  title_container: {
    flexShrink: 1,
  },

  title_text: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  content_container: {
    marginLeft: 11,
    paddingHorizontal: 16,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },

  content_text: {
    fontSize: 15,
    lineHeight: 20,
  },

  index_container: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  index: {
    fontWeight: 'bold',
    fontSize: 13,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title_text: {
      color: config.styles.light.secondaryTextColor,
    },

    content_container: {
      borderLeftColor: config.styles.light.secondaryBackgroundColor,
    },

    content_text: {
      color: config.styles.light.primaryTextColor,
    },

    index_container: {
      backgroundColor: config.styles.light.secondaryTextColor,
    },

    index: {
      color: config.styles.light.primaryBackgroundColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title_text: {
      color: config.styles.dark.primaryTextColor,
    },

    content_container: {
      borderLeftColor: config.styles.dark.secondaryBackgroundColor,
    },

    content_text: {
      color: config.styles.dark.primaryTextColor,
    },

    index_container: {
      backgroundColor: config.styles.dark.primaryTextColor,
    },

    index: {
      color: config.styles.dark.primaryBackgroundColor,
    },
  }),
);
