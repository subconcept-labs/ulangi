/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, ViewStyle } from 'react-native';

export interface VocabularyDetailPronunciationStyles {
  container: ViewStyle;
  speak_touchable: ViewStyle;
  speaker_icon: ImageStyle;
  activity_indicator: ViewStyle;
}

export const baseStyles: VocabularyDetailPronunciationStyles = StyleSheet.create(
  {
    container: {
      marginTop: 22,
    },

    speak_touchable: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    speaker_icon: {},

    activity_indicator: {},
  }
);

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));
