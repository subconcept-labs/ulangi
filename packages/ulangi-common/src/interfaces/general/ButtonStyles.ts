/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { TextStyle, ViewStyle } from 'react-native';

export interface ButtonStyles {
  readonly textStyle?: TextStyle;
  readonly buttonStyle?: ViewStyle;
  readonly disabledTextStyle?: TextStyle;
  readonly disabledButtonStyle?: ViewStyle;
}
