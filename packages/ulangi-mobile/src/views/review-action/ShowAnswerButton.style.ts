/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import { ss } from '../../utils/responsive';

export interface ShowAnswerButtonStyles {
  container: ViewStyle;
  show_answer_button_container: ViewStyle;
}

export const baseStyles: ShowAnswerButtonStyles = {
  container: {},

  show_answer_button_container: {
    paddingHorizontal: ss(16),
    paddingVertical: ss(12),
  },
};

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));
