/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SelectableImageStyles {
  image_container: ViewStyle;
  image: ImageStyle;
  selected: ImageStyle;
}

export const baseStyles: SelectableImageStyles = {
  image_container: {},

  image: {
    backgroundColor: '#ddd',
  },

  selected: {
    borderWidth: 3,
    borderColor: config.styles.primaryColor,
  },
};

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));
