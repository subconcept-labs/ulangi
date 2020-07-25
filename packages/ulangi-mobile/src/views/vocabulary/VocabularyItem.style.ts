/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface VocabularyItemStyles {
  item_container: ViewStyle;
  vocabulary_container: ViewStyle;
  top_container: ViewStyle;
  term_container: ViewStyle;
  tag_list: ViewStyle;
  tag_container: ViewStyle;
  tag_text: TextStyle;
  dot_container: ViewStyle;
  dot: TextStyle;
  term: TextStyle;
  missing_term: TextStyle;
  option_btn: ViewStyle;
  definition_list_container: ViewStyle;
  highlighted: TextStyle;
}

const baseStyles: VocabularyItemStyles = {
  item_container: {
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.3 },
    shadowRadius: 0.75,
    shadowOpacity: 0.25,
  },

  vocabulary_container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  top_container: {
    paddingVertical: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  term_container: {
    flexShrink: 1,
    //flexDirection: "row",
    //alignItems: "center"
  },

  tag_list: {
    flexDirection: 'row',
  },

  tag_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  tag_text: {
    fontSize: 12,
  },

  dot_container: {
    paddingHorizontal: 6,
  },

  dot: {
    fontSize: 17,
  },

  term: {
    fontSize: 19,
    fontWeight: 'bold',
  },

  missing_term: {
    fontSize: 16,
    fontStyle: 'italic',
  },

  option_btn: {
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  definition_list_container: {
    borderTopWidth: 2,
  },

  highlighted: {
    color: config.styles.primaryColor,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      elevation: 1,
    },
    term: {
      color: config.styles.light.primaryTextColor,
    },

    tag_text: {
      color: config.styles.light.secondaryTextColor,
    },

    dot: {
      color: config.styles.light.secondaryTextColor,
    },

    missing_term: {
      color: config.styles.light.secondaryTextColor,
    },

    definition_list_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    item_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      elevation: 3,
    },

    term: {
      color: config.styles.dark.primaryTextColor,
    },

    tag_text: {
      color: config.styles.dark.secondaryTextColor,
    },

    dot: {
      color: config.styles.dark.secondaryTextColor,
    },

    missing_term: {
      color: config.styles.dark.secondaryTextColor,
    },

    definition_list_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },
  }),
);
