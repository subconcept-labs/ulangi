/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface PublicVocabularyListStyles {
  list_container: ViewStyle;
}

export class PublicVocabularyListResponsiveStyles extends ResponsiveStyleSheet<
  PublicVocabularyListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): PublicVocabularyListStyles {
    return {
      list_container: {
        paddingBottom: scaleByFactor(74),
      },
    };
  }

  public lightStyles(): Partial<PublicVocabularyListStyles> {
    return {};
  }

  public darkStyles(): Partial<PublicVocabularyListStyles> {
    return {};
  }
}

export const publicVocabularyListResponsiveStyles = new PublicVocabularyListResponsiveStyles();
