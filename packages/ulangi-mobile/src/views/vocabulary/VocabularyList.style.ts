/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyListStyles {
  activity_indicator: ViewStyle;
  list_container: ViewStyle;
  list: ViewStyle;
}

export class VocabularyListResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyListStyles
> {
  public baseStyles(scaleByFactor: ScaleByFactor): VocabularyListStyles {
    return {
      activity_indicator: {
        marginBottom: scaleByFactor(16),
      },

      list_container: {
        flex: 1,
      },

      list: {
        paddingTop: scaleByFactor(16),
        paddingBottom: scaleByFactor(74),
      },
    };
  }

  public lightStyles(): Partial<VocabularyListStyles> {
    return {};
  }

  public darkStyles(): Partial<VocabularyListStyles> {
    return {};
  }
}

export const vocabularyListResponsiveStyles = new VocabularyListResponsiveStyles();
