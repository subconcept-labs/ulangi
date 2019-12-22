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
  disable_btn: ViewStyle;
  message: TextStyle;
  message_highlighted: TextStyle;
}

export const baseStyles: WritingFormStyles = {
  container: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },

  row: {
    paddingVertical: 6,
  },

  label: {
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 19,
    paddingBottom: 1,
  },

  definition_container: {
    marginTop: 5,
    borderRadius: 10,
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
    fontSize: 16,
    paddingVertical: 3,
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
    fontSize: 16,
    paddingVertical: 3,
  },

  underline: {
    height: 2,
    borderRadius: 1,
    marginBottom: 2,
  },

  button_container: {
    marginLeft: 5,
  },

  disable_btn: {
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  message: {
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 19,
  },

  message_highlighted: {
    color: config.styles.primaryColor,
    fontSize: 15,
    lineHeight: 19,
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

    disable_btn: {
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    hint_text: {
      color: config.styles.light.primaryTextColor,
    },

    message: {
      color: config.styles.light.primaryTextColor,
    },
  })
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
      backgroundColor: config.styles.dark.primaryTextColor,
    },

    disable_btn: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
    },

    hint_text: {
      color: config.styles.dark.primaryTextColor,
    },

    message: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);

export const definitionItemLightStyles = _.merge(
  {},
  defaultDefinitionItemLightStyles,
  {
    item_container: {
      borderTopWidth: 0,
    },
  }
);

export const definitionItemDarkStyles = _.merge(
  {},
  defaultDefinitionItemDarkStyles,
  {
    item_container: {
      borderTopWidth: 0,
    },
  }
);
