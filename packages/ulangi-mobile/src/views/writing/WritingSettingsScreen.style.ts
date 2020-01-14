/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  darkStyles as defaultSectionRowDarkStyles,
  lightStyles as defaultSectionRowLightStyles,
} from '../section/SectionRow.style';

export interface WritingSettingsScreenStyles {
  screen: ViewStyle;
  content_container: ViewStyle;
  description: TextStyle;
  touchable_text: TextStyle;
}

export const baseStyles: WritingSettingsScreenStyles = {
  screen: {
    flex: 1,
  },

  content_container: {
    paddingTop: 16,
  },

  description: {
    fontSize: 15,
    color: '#888',
    lineHeight: 19,
  },

  touchable_text: {},
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    description: {
      color: config.styles.light.secondaryTextColor,
    },

    touchable_text: {
      color: config.styles.primaryColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    description: {
      color: config.styles.light.secondaryTextColor,
    },

    touchable_text: {
      color: config.styles.primaryColor,
    },
  }),
);

export const sectionRowLightStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowLightStyles, {
    left_text: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    inner_container: {
      backgroundColor: '#f0f0f0',
    },
  }),
);

export const sectionRowDarkStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowDarkStyles, {
    left_text: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  }),
);
