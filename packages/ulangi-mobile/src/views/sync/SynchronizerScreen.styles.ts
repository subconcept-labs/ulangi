/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface SynchronizerScreenStyles {
  screen: ViewStyle;
  indicator: ViewStyle;
  icon: ImageStyle;
  sync_btn: ViewStyle;
  sync_btn_text: TextStyle;
  sync_state_container: ViewStyle;
  sync_state: TextStyle;
  title: TextStyle;
  paragraph: TextStyle;
}

export const baseStyles: SynchronizerScreenStyles = {
  screen: {
    flex: 1,
  },

  indicator: {
    marginRight: 4,
  },

  icon: {
    marginRight: 4,
  },

  sync_btn: {
    marginLeft: 16,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.75,
    shadowOpacity: 0.2,
    elevation: 1,
  },

  sync_btn_text: {
    fontSize: 14,
  },

  sync_state_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sync_state: {
    fontSize: 16,
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  paragraph: {
    paddingVertical: 6,
    lineHeight: 19,
    fontSize: 14,
  },
};

export const lightStyles: SynchronizerScreenStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    sync_btn: {
      borderColor: config.styles.light.primaryBorderColor,
      backgroundColor: config.styles.light.secondaryBackgroundColor,
    },

    sync_btn_text: {
      color: config.styles.light.primaryTextColor,
    },

    sync_state: {
      color: config.styles.light.primaryTextColor,
    },

    title: {
      color: config.styles.light.secondaryTextColor,
    },

    paragraph: {
      color: config.styles.light.primaryTextColor,
    },
  }),
);

export const darkStyles: SynchronizerScreenStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    sync_btn: {
      borderColor: config.styles.dark.primaryBorderColor,
      backgroundColor: config.styles.dark.secondaryBackgroundColor,
    },

    sync_btn_text: {
      color: config.styles.dark.primaryTextColor,
    },

    sync_state: {
      color: config.styles.dark.primaryTextColor,
    },

    title: {
      color: config.styles.dark.secondaryTextColor,
    },

    paragraph: {
      color: config.styles.dark.primaryTextColor,
    },
  }),
);
