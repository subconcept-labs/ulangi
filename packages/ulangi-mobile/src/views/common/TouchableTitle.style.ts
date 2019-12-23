/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import {
  Dimensions,
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { config } from '../../constants/config';

export interface TouchableTitleStyles {
  title_container: ViewStyle;
  title: TextStyle;
  content_container: ViewStyle;
  icon: ImageStyle;
  caret: ImageStyle;
}

export const baseStyles: TouchableTitleStyles = {
  title_container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    width: Dimensions.get('window').width / 2,
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    flexShrink: 1,
  },

  content_container: {
    height: 32,
    borderRadius: 16,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 22,
    height: 22,
  },

  caret: {
    marginRight: 4,
  },
};

export const lightStyles: TouchableTitleStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: '#888',
    },
    content_container: {
      backgroundColor: '#eee',
    },
  }),
);

export const darkStyles: TouchableTitleStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    title: {
      color: config.styles.dark.primaryBackgroundColor,
    },
    content_container: {
      backgroundColor: config.styles.dark.primaryTextColor,
    },
  }),
);
