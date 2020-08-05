/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';
import {
  DefinitionItemResponsiveStyles,
  DefinitionItemStyles,
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

export class WritingFormResponsiveStyles extends ResponsiveStyleSheet<
  WritingFormStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): WritingFormStyles {
    return {
      container: {
        paddingHorizontal: scaleByFactor(16),
        marginVertical: scaleByFactor(20),
      },

      row: {
        paddingVertical: scaleByFactor(6),
      },

      label: {
        fontSize: scaleByFactor(11),
        fontWeight: 'bold',
        lineHeight: scaleByFactor(19),
        paddingBottom: scaleByFactor(1),
      },

      definition_container: {
        marginTop: scaleByFactor(5),
        borderRadius: scaleByFactor(10),
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
        fontSize: scaleByFactor(16),
        paddingVertical: scaleByFactor(3),
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
        fontSize: scaleByFactor(16),
        paddingVertical: scaleByFactor(3),
      },

      underline: {
        height: scaleByFactor(2),
        borderRadius: scaleByFactor(1),
        marginBottom: scaleByFactor(2),
      },

      button_container: {
        marginLeft: scaleByFactor(5),
      },

      message: {
        flexShrink: 1,
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(19),
      },

      message_highlighted: {
        color: config.styles.primaryColor,
        fontSize: scaleByFactor(15),
        lineHeight: scaleByFactor(19),
      },
    };
  }

  public lightStyles(): Partial<WritingFormStyles> {
    return {
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
    };
  }

  public darkStyles(): Partial<WritingFormStyles> {
    return {
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
    };
  }
}

export const writingFormResponsiveStyles = new WritingFormResponsiveStyles();

export class ExtendedDefinitionItemResponsiveStyles extends DefinitionItemResponsiveStyles {
  public baseStyles(scaleByFactor: ScaleByFactor): DefinitionItemStyles {
    return _.merge({}, super.baseStyles(scaleByFactor), {
      item_container: {
        borderTopWidth: 0,
      },
    });
  }
}

export const definitionItemResponsiveStyles = new ExtendedDefinitionItemResponsiveStyles();
