/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle } from 'react-native';

import { config } from '../../constants/config';

export interface DictionarySectionStyles {
  highlighted_text: TextStyle;
  bold: TextStyle;
}

export const baseStyles: DictionarySectionStyles = {
  highlighted_text: {
    color: config.styles.primaryColor,
  },

  bold: {
    fontWeight: 'bold',
  },
};

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));
