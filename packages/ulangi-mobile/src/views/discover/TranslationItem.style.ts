/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  ResponsiveStyleSheet,
  ScaleByBreakpoints,
  ScaleByFactor,
  defaultHorizontalMarginByBreakpoints,
} from '../../utils/responsive';

export interface TranslationItemStyles {
  outer_container: ViewStyle;
  inner_container: ViewStyle;
  vocabulary_text_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  vocabulary_text: TextStyle;
  button: ViewStyle;
  definition_list_container: ViewStyle;
  definition_container: ViewStyle;
  meaning_container: ViewStyle;
  meaning: TextStyle;
  attribution_container: ViewStyle;
}

export class TranslationItemResponsiveStyles extends ResponsiveStyleSheet<
  TranslationItemStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
    scaleByBreakpoints: ScaleByBreakpoints,
  ): TranslationItemStyles {
    return {
      outer_container: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.3 },
        shadowRadius: 0.75,
        shadowOpacity: 0.25,
      },

      inner_container: {
        marginHorizontal: scaleByBreakpoints(
          defaultHorizontalMarginByBreakpoints,
        ),
        marginTop: scaleByFactor(16),
        borderRadius: scaleByFactor(5),
        overflow: 'hidden',
        elevation: 2,
      },

      vocabulary_text_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      left: {
        flexShrink: 1,
      },

      right: {
        marginLeft: scaleByFactor(8),
        flexDirection: 'row',
        alignItems: 'center',
      },

      vocabulary_text: {
        fontWeight: 'bold',
        fontSize: scaleByFactor(18),
      },

      button: {
        height: scaleByFactor(30),
        width: scaleByFactor(32),
        borderRadius: scaleByFactor(3),
        borderWidth: 1,
        marginLeft: scaleByFactor(7),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowRadius: 0.75,
        shadowOpacity: 0.15,
        elevation: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
      },

      definition_list_container: {
        borderTopWidth: 2,
      },

      definition_container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(8),
        flexDirection: 'row',
        alignItems: 'center',
      },

      meaning_container: {
        flexShrink: 1,
        paddingVertical: scaleByFactor(3),
      },

      meaning: {
        fontSize: scaleByFactor(17),
      },

      attribution_container: {
        paddingVertical: scaleByFactor(13),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: scaleByFactor(16),
      },
    };
  }

  public lightStyles(): Partial<TranslationItemStyles> {
    return {
      inner_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      vocabulary_text: {
        color: config.styles.light.primaryTextColor,
      },

      button: {
        borderColor: config.styles.light.primaryBorderColor,
        backgroundColor: config.styles.light.primaryBackgroundColor,
      },

      definition_list_container: {
        borderTopColor: config.styles.light.secondaryBorderColor,
      },

      definition_container: {
        borderTopColor: config.styles.light.secondaryBorderColor,
      },

      meaning: {
        color: config.styles.light.primaryTextColor,
      },

      attribution_container: {
        backgroundColor: config.styles.light.tertiaryBackgroundColor,
        borderTopColor: config.styles.light.secondaryBorderColor,
      },
    };
  }

  public darkStyles(): Partial<TranslationItemStyles> {
    return {
      inner_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      vocabulary_text: {
        color: config.styles.dark.primaryTextColor,
      },

      button: {
        borderColor: config.styles.dark.primaryBorderColor,
        backgroundColor: config.styles.dark.primaryBackgroundColor,
      },

      definition_list_container: {
        borderTopColor: config.styles.dark.primaryBorderColor,
      },

      definition_container: {
        borderTopColor: config.styles.dark.secondaryBorderColor,
      },

      meaning: {
        color: config.styles.dark.primaryTextColor,
      },

      attribution_container: {
        backgroundColor: config.styles.dark.tertiaryBackgroundColor,
        borderTopColor: config.styles.dark.secondaryBorderColor,
      },
    };
  }
}

export const translationItemResponsiveStyles = new TranslationItemResponsiveStyles();
