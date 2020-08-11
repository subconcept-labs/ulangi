/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface MultipleChoiceFormStyles {
  multiple_choice_container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  vocabulary_text: TextStyle;
  accessory: TextStyle;
  answer_container: ViewStyle;
  answer_touchable: ViewStyle;
  meaning_container: ViewStyle;
  meaning: TextStyle;
  uncheck: ImageStyle;
}

export class MultipleChoiceFormResponsiveStyles extends ResponsiveStyleSheet<
  MultipleChoiceFormStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): MultipleChoiceFormStyles {
    return {
      multiple_choice_container: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        borderRadius: scaleByFactor(10),
      },

      vocabulary_text_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(14),
      },

      vocabulary_text: {
        fontSize: scaleByFactor(15),
        fontWeight: 'bold',
      },

      accessory: {},

      answer_container: {
        borderTopWidth: 1,
      },

      answer_touchable: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(10),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },

      meaning_container: {
        flexShrink: 1,
        paddingVertical: scaleByFactor(2),
      },

      meaning: {
        fontSize: scaleByFactor(15),
      },

      uncheck: {
        marginRight: scaleByFactor(8),
      },
    };
  }

  public lightStyles(): Partial<MultipleChoiceFormStyles> {
    return {
      multiple_choice_container: {
        backgroundColor: config.styles.light.secondaryBackgroundColor,
      },

      vocabulary_text: {
        color: config.styles.light.primaryTextColor,
      },

      accessory: {
        color: config.styles.light.secondaryTextColor,
      },

      answer_container: {
        borderTopColor: config.styles.light.primaryBackgroundColor,
      },

      meaning: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<MultipleChoiceFormStyles> {
    return {
      multiple_choice_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      vocabulary_text: {
        color: config.styles.dark.primaryTextColor,
      },

      accessory: {
        color: config.styles.dark.secondaryTextColor,
      },

      answer_container: {
        borderTopColor: config.styles.dark.secondaryBackgroundColor,
      },

      meaning: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const multipleChoiceFormResponsiveStyles = new MultipleChoiceFormResponsiveStyles();
