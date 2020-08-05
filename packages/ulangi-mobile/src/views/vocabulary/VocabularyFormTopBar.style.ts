/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyFormTopBarStyles {
  top_bar_container: ViewStyle;
  text_container: ViewStyle;
  text: TextStyle;
  selectedContainerStyle: ViewStyle;
  selectedTextStyle: TextStyle;
}

export class VocabularyFormTopBarResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyFormTopBarStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): VocabularyFormTopBarStyles {
    return {
      top_bar_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: -StyleSheet.hairlineWidth,
        zIndex: 1,
      },

      text_container: {
        flex: 1,
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(8),
        alignItems: 'center',
      },

      text: {
        fontSize: scaleByFactor(14),
        fontWeight: 'bold',
      },

      selectedContainerStyle: {
        borderBottomWidth: 2,
      },

      selectedTextStyle: {},
    };
  }

  public lightStyles(): Partial<VocabularyFormTopBarStyles> {
    return {
      top_bar_container: {
        borderBottomColor: config.styles.light.primaryBorderColor,
      },

      text: {
        color: config.styles.light.secondaryTextColor,
      },

      selectedContainerStyle: {
        borderBottomColor: config.styles.light.primaryTextColor,
      },

      selectedTextStyle: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<VocabularyFormTopBarStyles> {
    return {
      top_bar_container: {
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },

      text: {
        color: config.styles.dark.secondaryTextColor,
      },

      selectedContainerStyle: {
        borderBottomColor: config.styles.primaryColor,
      },

      selectedTextStyle: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const vocabularyFormTopBarResponsiveStyles = new VocabularyFormTopBarResponsiveStyles();
