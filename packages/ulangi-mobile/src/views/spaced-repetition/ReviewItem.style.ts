/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  darkStyles as defaultDefinitionItemDarkStyles,
  lightStyles as defaultDefinitionItemLightStyles,
} from '../vocabulary/DefinitionItem.style';

export interface ReviewItemStyles {
  vocabulary_container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  vocabulary_text: TextStyle;
  top_container: ViewStyle;
  message_container: ViewStyle;
  message_inline: TextStyle;
  message_text: TextStyle;
  message_text_highlighted: TextStyle;
  definition_list_container: ViewStyle;
  bold: TextStyle;
}

export const baseStyles: ReviewItemStyles = {
  vocabulary_container: {
    marginHorizontal: 16,
    backgroundColor: '#ececec',
    borderRadius: 10,
    marginTop: 20,
  },

  vocabulary_text_container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  top_container: {
    paddingVertical: 3,
    flexDirection: 'row',
  },

  vocabulary_text: {
    fontSize: 19,
    fontWeight: 'bold',
  },

  message_container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },

  message_inline: {
    flexShrink: 1,
  },

  message_text: {
    fontSize: 15,
    lineHeight: 19,
  },

  message_text_highlighted: {
    color: config.styles.primaryColor,
    fontSize: 15,
    lineHeight: 19,
  },

  bold: {
    fontWeight: 'bold',
  },

  definition_list_container: {
    borderTopWidth: 2,
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

    message_container: {
      borderTopColor: config.styles.light.primaryBackgroundColor,
    },

    message_inline: {
      color: config.styles.light.secondaryTextColor,
    },

    message_text: {
      color: config.styles.light.primaryTextColor,
    },

    definition_list_container: {
      borderTopColor: config.styles.light.secondaryBorderColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    vocabulary_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    vocabulary_text: {
      color: config.styles.dark.primaryTextColor,
    },

    message_container: {
      borderTopColor: config.styles.dark.secondaryBackgroundColor,
    },

    message_inline: {
      color: config.styles.dark.secondaryTextColor,
    },

    message_text: {
      color: config.styles.dark.primaryTextColor,
    },

    definition_list_container: {
      borderTopColor: config.styles.dark.secondaryBorderColor,
    },
  }),
);

export const definitionItemLightStyles = _.merge(
  {},
  defaultDefinitionItemLightStyles,
  {
    item_container: {
      borderTopWidth: 1,
      borderTopColor: config.styles.light.primaryBackgroundColor,
    },
  },
);

export const definitionItemDarkStyles = _.merge(
  {},
  defaultDefinitionItemDarkStyles,
  {
    item_container: {
      borderTopWidth: 1,
      borderTopColor: config.styles.dark.secondaryBackgroundColor,
    },
  },
);
