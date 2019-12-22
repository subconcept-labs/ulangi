/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface VocabularyExtraFieldListStyles {
  container: ViewStyle;
  item_container: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  image: ImageStyle;
  name: TextStyle;
  value: TextStyle;
  speak_touchable: ViewStyle;
  speaker_icon: ImageStyle;
  activity_indicator: ViewStyle;
}

const baseStyles: VocabularyExtraFieldListStyles = {
  container: {},

  item_container: {
    marginBottom: 10,
    paddingHorizontal: 16,
    //borderTopWidth: StyleSheet.hairlineWidth,
    //borderTopColor: config.styles.light.primaryBorderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {},

  right: {},

  image: {
    width: 100,
    height: 100,
  },

  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#aaa',
  },

  value: {
    fontSize: 15,
    //fontWeight: 'bold',
    color: '#222',
  },

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
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    name: {
      color: config.styles.light.secondaryTextColor,
    },

    value: {
      color: config.styles.light.primaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    name: {
      color: config.styles.dark.secondaryTextColor,
    },

    value: {
      color: config.styles.dark.primaryTextColor,
    },
  })
);
