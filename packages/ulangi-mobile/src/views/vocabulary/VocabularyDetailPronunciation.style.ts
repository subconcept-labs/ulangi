/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyDetailPronunciationStyles {
  container: ViewStyle;
  speak_touchable: ViewStyle;
  speaker_icon: ImageStyle;
  activity_indicator: ViewStyle;
}

export class VocabularyDetailPronunciationResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyDetailPronunciationStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): VocabularyDetailPronunciationStyles {
    return {
      container: {
        marginTop: scaleByFactor(22),
      },

      speak_touchable: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      speaker_icon: {},

      activity_indicator: {},
    };
  }

  public lightStyles(): Partial<VocabularyDetailPronunciationStyles> {
    return {};
  }

  public darkStyles(): Partial<VocabularyDetailPronunciationStyles> {
    return {};
  }
}

export const vocabularyDetailPronunciationResponsiveStyles = new VocabularyDetailPronunciationResponsiveStyles();
