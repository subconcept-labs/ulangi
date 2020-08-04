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
    paddingVertical: ss(8),
  },

  section_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(10),
  },

  header_container: {
    flexDirection: 'row',
    paddingVertical: ss(4),
    alignItems: 'center',
  },

  title_container: {
    flexShrink: 1,
  },

  title_text: {
    fontWeight: 'bold',
    fontSize: ss(16),
  },

  content_container: {
    marginLeft: ss(11),
    paddingHorizontal: ss(16),
    borderLeftWidth: StyleSheet.hairlineWidth,
  },

  content_text: {
    fontSize: ss(15),
    lineHeight: ss(20),
  },

  index_container: {
    width: ss(22),
    height: ss(22),
    borderRadius: ss(22) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ss(5),
  },

  index: {
    fontWeight: 'bold',
    fontSize: ss(13),
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
      color: config.styles.dark.secondaryTextColor,
    },

    content_container: {
      borderLeftColor: config.styles.dark.secondaryBackgroundColor,
    },

    content_text: {
      color: config.styles.dark.primaryTextColor,
    },

    index_container: {
      backgroundColor: config.styles.dark.secondaryTextColor,
    },

    index: {
      color: config.styles.dark.primaryBackgroundColor,
    },
  }),
);
