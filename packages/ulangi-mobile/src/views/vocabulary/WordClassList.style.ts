/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface WordClassListStyles {
  word_class_container: ViewStyle;
  word_class: TextStyle;
}

export class WordClassListResponsiveStyles extends ResponsiveStyleSheet<
  WordClassListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): WordClassListStyles {
    return {
      word_class_container: {
        borderRadius: scaleByFactor(3),
        marginVertical: scaleByFactor(2),
        paddingVertical: scaleByFactor(1),
        paddingHorizontal: scaleByFactor(7),
        marginRight: scaleByFactor(5),
      },

      word_class: {
        textAlign: 'center',
        fontSize: scaleByFactor(15),
      },
    };
  }

  public lightStyles(): Partial<WordClassListStyles> {
    return {};
  }

  public darkStyles(): Partial<WordClassListStyles> {
    return {};
  }
}

export const wordClassListResponsiveStyles = new WordClassListResponsiveStyles();
