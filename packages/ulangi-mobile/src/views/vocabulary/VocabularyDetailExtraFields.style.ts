/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, ViewStyle } from 'react-native';

import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyDetailExtraFieldsStyles {
  speak_touchable: ViewStyle;
  speaker_icon: ImageStyle;
  activity_indicator: ViewStyle;
  image: ImageStyle;
}

export class VocabularyDetailExtraFieldsResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyDetailExtraFieldsStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): VocabularyDetailExtraFieldsStyles {
    return {
      speak_touchable: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      speaker_icon: {
        marginLeft: scaleByFactor(6),
      },

      activity_indicator: {
        marginLeft: scaleByFactor(6),
      },

      image: {
        width: scaleByFactor(100),
        height: scaleByFactor(100),
      },
    };
  }

  public lightStyles(): Partial<VocabularyDetailExtraFieldsStyles> {
    return {};
  }

  public darkStyles(): Partial<VocabularyDetailExtraFieldsStyles> {
    return {};
  }
}

export const vocabularyDetailExtraFieldsResponsiveStyles = new VocabularyDetailExtraFieldsResponsiveStyles();
