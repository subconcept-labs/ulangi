/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { Dimensions, StyleSheet, ViewStyle } from 'react-native';

export interface StrokeOrdersStyles {
  webview: ViewStyle;
}

export const baseStyles: StrokeOrdersStyles = {
  webview: {
    zIndex: 10,
    width: Dimensions.get('window').width - 16 * 2,
    marginVertical: 16,
  },
};

export const lightStyles = StyleSheet.create(_.merge({}, baseStyles, {}));

export const darkStyles = StyleSheet.create(_.merge({}, baseStyles, {}));
