/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export interface ManageScreenStyles {
  screen: ViewStyle;
  bulk_action_bar_container: ViewStyle;
  floating_action_button: TextStyle;
  syncing_notice: TextStyle;
}

export const baseStyle: ManageScreenStyles = {
  screen: {
    flex: 1,
  },

  bulk_action_bar_container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },

  floating_action_button: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },

  syncing_notice: {
    position: 'absolute',
    left: (Dimensions.get('window').width - 120) / 2,
    bottom: 16,
    width: 120,
    flexDirection: 'row',
    justifyContent: 'center',
  },
};

export const lightStyles = StyleSheet.create(_.merge({}, baseStyle, {}));

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyle, {
    screen: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#131313',
    },
  }),
);
