/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ls, ss } from '../../utils/responsive';
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
  message_text_highlighted: TextStyle;
  definition_list_container: ViewStyle;
  bold: TextStyle;
}

export const baseStyles: ReviewItemStyles = {
  vocabulary_container: {
    marginHorizontal: ls(16),
    backgroundColor: '#ececec',
    borderRadius: ss(10),
    marginTop: ss(20),
  },

  vocabulary_text_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(14),
  },

  top_container: {
    paddingVertical: ss(3),
    flexDirection: 'row',
  },

  vocabulary_text: {
    fontSize: ss(19),
    fontWeight: 'bold',
  },

  message_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(12),
    borderTopWidth: ss(2),
    flexDirection: 'row',
    alignItems: 'center',
  },

  message_inline: {
    flexShrink: 1,
    fontSize: ss(15),
    lineHeight: ss(19),
  },

  message_text_highlighted: {
    color: config.styles.primaryColor,
    fontSize: ss(15),
    lineHeight: ss(19),
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
