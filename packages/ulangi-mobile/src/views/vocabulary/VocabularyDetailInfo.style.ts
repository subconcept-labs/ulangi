/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyDetailInfoStyles {
  container: ViewStyle;
  title_container: ViewStyle;
  title_text: TextStyle;
  content_container: ViewStyle;
  row_container: ViewStyle;
  left_text: TextStyle;
  right_text: TextStyle;
}

export class VocabularyDetailInfoResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyDetailInfoStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): VocabularyDetailInfoStyles {
    return {
      container: {
        paddingTop: scaleByFactor(18),
      },

      title_container: {
        paddingHorizontal: scaleByFactor(16),
      },

      title_text: {
        fontSize: scaleByFactor(12),
        color: '#999',
      },

      content_container: {
        marginTop: scaleByFactor(6),
        backgroundColor: 'white',
        borderTopColor: '#cecece',
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      row_container: {
        paddingHorizontal: scaleByFactor(16),
        paddingVertical: scaleByFactor(10),
        borderBottomColor: '#cecece',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      left_text: {
        fontSize: scaleByFactor(16),
        color: '#333',
      },

      right_text: {
        fontSize: scaleByFactor(16),
        color: '#888',
      },
    };
  }

  public lightStyles(): Partial<VocabularyDetailInfoStyles> {
    return {};
  }

  public darkStyles(): Partial<VocabularyDetailInfoStyles> {
    return {};
  }
}

export const vocabularyDetailInfoResponsiveStyles = new VocabularyDetailInfoResponsiveStyles();
