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

export interface WritingFormStyles {
  container: ViewStyle;
  row: ViewStyle;
  label: TextStyle;
  definition_container: ViewStyle;
  answer_container: ViewStyle;
  answer: TextStyle;
  input: TextStyle;
  hint_container: ViewStyle;
  hint_text_container: ViewStyle;
  hint_scrollview: ViewStyle;
  hint_text: TextStyle;
  underline: ViewStyle;
  button_container: ViewStyle;
  message: TextStyle;
  message_highlighted: TextStyle;
}

export const baseStyles: WritingFormStyles = {
  container: {
    paddingHorizontal: ls(16),
    marginVertical: ss(20),
  },

  row: {
    paddingVertical: ss(6),
  },

  label: {
    fontSize: ss(11),
    fontWeight: 'bold',
    lineHeight: ss(19),
    paddingBottom: ss(1),
  },

  definition_container: {
    marginTop: ss(5),
    borderRadius: ss(10),
  },

  answer_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  answer: {
    flex: 1,
  },

  input: {
    fontSize: ss(16),
    paddingVertical: ss(3),
  },

  hint_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hint_text_container: {
    flex: 1,
  },

  hint_scrollview: {},

  hint_text: {
    fontSize: ss(16),
    paddingVertical: ss(3),
  },

  underline: {
    height: ss(2),
    borderRadius: ss(1),
    marginBottom: ss(2),
  },

  button_container: {
    marginLeft: ss(5),
  },

  message: {
    flexShrink: 1,
    fontSize: ss(15),
    lineHeight: ss(19),
  },

  message_highlighted: {
    color: config.styles.primaryColor,
    fontSize: ss(15),
    lineHeight: ss(19),
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    label: {
      color: config.styles.light.secondaryTextColor,
    },

    definition_container: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    input: {
      color: config.styles.light.primaryTextColor,
    },

    underline: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    hint_text: {
      color: config.styles.light.primaryTextColor,
    },

    message: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    label: {
      color: config.styles.dark.secondaryTextColor,
    },

    definition_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    input: {
      color: config.styles.dark.primaryTextColor,
    },

    underline: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    hint_text: {
      color: config.styles.dark.primaryTextColor,
    },

    message: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);

export const definitionItemLightStyles = _.merge(
  {},
  defaultDefinitionItemLightStyles,
  {
    item_container: {
      borderTopWidth: 0,
    },
  },
);

export const definitionItemDarkStyles = _.merge(
  {},
  defaultDefinitionItemDarkStyles,
  {
    item_container: {
      borderTopWidth: 0,
    },
  },
);
