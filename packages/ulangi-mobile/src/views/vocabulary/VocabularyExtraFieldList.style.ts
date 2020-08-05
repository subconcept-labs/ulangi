/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet, ScaleByFactor } from '../../utils/responsive';

export interface VocabularyExtraFieldListStyles {
  container: ViewStyle;
  item_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  image: ImageStyle;
  name: TextStyle;
  value: TextStyle;
  speak_touchable: ViewStyle;
  speaker_icon: ImageStyle;
  activity_indicator: ViewStyle;
}

export class VocabularyExtraFieldListResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyExtraFieldListStyles
> {
  public baseStyles(
    scaleByFactor: ScaleByFactor,
  ): VocabularyExtraFieldListStyles {
    return {
      container: {},

      item_container: {
        marginVertical: scaleByFactor(4),
        //borderTopWidth: StyleSheet.hairlineWidth,
        //borderTopColor: config.styles.light.primaryBorderColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      left: {},

      right: {},

      image: {
        width: 100,
        height: 100,
      },

      name: {
        fontSize: scaleByFactor(15),
        fontWeight: '700',
      },

      value: {
        fontSize: scaleByFactor(17),
        //fontWeight: 'bold',
      },

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
    };
  }

  public lightStyles(): Partial<VocabularyExtraFieldListStyles> {
    return {
      name: {
        color: config.styles.light.secondaryTextColor,
      },

      value: {
        color: config.styles.light.primaryTextColor,
      },
    };
  }

  public darkStyles(): Partial<VocabularyExtraFieldListStyles> {
    return {
      name: {
        color: config.styles.dark.secondaryTextColor,
      },

      value: {
        color: config.styles.dark.primaryTextColor,
      },
    };
  }
}

export const vocabularyExtraFieldListResponsiveStyles = new VocabularyExtraFieldListResponsiveStyles();
