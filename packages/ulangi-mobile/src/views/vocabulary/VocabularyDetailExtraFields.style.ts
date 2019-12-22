/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, ViewStyle } from 'react-native';

export interface VocabularyDetailExtraFieldsStyles {
  speak_touchable: ViewStyle;
  speaker_icon: ImageStyle;
  activity_indicator: ViewStyle;
  image: ImageStyle;
}

export const baseStyles: VocabularyDetailExtraFieldsStyles = StyleSheet.create({
  speak_touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  speaker_icon: {
    marginLeft: 6,
  },

  activity_indicator: {
    marginLeft: 6,
  },

  image: {
    width: 100,
    height: 100,
  },
});

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));
