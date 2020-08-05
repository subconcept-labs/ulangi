/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, ViewStyle } from 'react-native';

import { ss } from '../../utils/responsive';

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
    marginLeft: ss(6),
  },

  activity_indicator: {
    marginLeft: ss(6),
  },

  image: {
    width: ss(100),
    height: ss(100),
  },
});

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));
