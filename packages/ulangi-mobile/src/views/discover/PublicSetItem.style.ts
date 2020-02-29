/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface PublicSetItemStyles {
  item_container: ViewStyle;
  top_container: ViewStyle;
  title: TextStyle;
  set_name: TextStyle;
  set_subtitle: TextStyle;
  meta_container: ViewStyle;
  authors: TextStyle;
  dot: TextStyle;
  curated_text: TextStyle;
  count: TextStyle;
  terms: TextStyle;
  left: ViewStyle;
  right: ViewStyle;
  bottom_container: ViewStyle;
  content: TextStyle;
  content_bold: TextStyle;
  arrow: ImageStyle;
}

export const baseStyles: PublicSetItemStyles = {
  item_container: {
    marginHorizontal: 16,
    // Use padding instead of margin to make hit area larger
    marginVertical: 8,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.3 },
    shadowRadius: 0.75,
    shadowOpacity: 0.2,
  },

  top_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  title: {
    paddingBottom: 3,
  },

  set_name: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  set_subtitle: {
    fontSize: 15,
  },

  meta_container: {},

  authors: {
    fontSize: 12,
  },

  dot: {
    fontSize: 12,
  },

  curated_text: {
    fontSize: 12,
    fontWeight: '700',
  },

  count: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 3,
  },

  terms: {
    fontSize: 12,
  },

  left: {
    paddingRight: 12,
    flexShrink: 1,
  },

  right: {
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottom_container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  arrow: {
    marginRight: 5,
  },

  content: {
    flexShrink: 1,
    fontSize: 14,
  },

  content_bold: {
    fontWeight: 'bold',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      elevation: 1,
    },

    set_name: {
      color: config.styles.light.primaryTextColor,
    },

    set_subtitle: {
      color: config.styles.light.secondaryTextColor,
    },

    authors: {
      color: config.styles.light.secondaryTextColor,
    },

    dot: {
      color: config.styles.light.secondaryTextColor,
    },

    curated_text: {
      color: config.styles.light.secondaryTextColor,
    },

    count: {
      color: config.styles.light.primaryTextColor,
    },

    terms: {
      color: config.styles.light.secondaryTextColor,
    },

    right: {
      borderLeftColor: config.styles.light.secondaryBorderColor,
    },

    bottom_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },

    content: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      elevation: 3,
    },

    set_name: {
      color: config.styles.dark.primaryTextColor,
    },

    set_subtitle: {
      color: config.styles.dark.secondaryTextColor,
    },

    authors: {
      color: config.styles.dark.secondaryTextColor,
    },

    dot: {
      color: config.styles.dark.secondaryTextColor,
    },

    curated_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    count: {
      color: config.styles.dark.primaryTextColor,
    },

    terms: {
      color: config.styles.dark.secondaryTextColor,
    },

    right: {
      borderLeftColor: config.styles.dark.secondaryBorderColor,
    },

    bottom_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },

    content: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);
