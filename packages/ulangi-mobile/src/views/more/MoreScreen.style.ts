/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import {
  darkStyles as defaultSectionRowDarkStyles,
  lightStyles as defaultSectionRowLightStyles,
} from '../section/SectionRow.style';

export interface MoreScreenStyles {
  screen: ViewStyle;
  scroll_view_container: ViewStyle;
  section_list: ViewStyle;
  description_text: TextStyle;
  left_icon: ImageStyle;
}

export const baseStyles: MoreScreenStyles = {
  screen: {
    flex: 1,
  },

  scroll_view_container: {
    flex: 1,
  },

  section_list: {
    marginTop: 22,
  },

  description_text: {},

  left_icon: {
    marginRight: 4,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    description_text: {
      color: config.styles.light.secondaryTextColor,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    description_text: {
      color: config.styles.dark.secondaryTextColor,
    },
  }),
);

export const regularMembershipSectionRowLightStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowLightStyles, {
    right_text: {
      color: config.styles.regularMembershipColor,
      fontWeight: 'bold',
    },
  }),
);

export const regularMembershipSectionRowDarkStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowDarkStyles, {
    right_text: {
      color: config.styles.regularMembershipColor,
      fontWeight: 'bold',
    },
  }),
);

export const premiumMembershipSectionRowLightStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowLightStyles, {
    right_text: {
      color: config.styles.premiumMembershipColor,
      fontWeight: 'bold',
    },
  }),
);

export const premiumMembershipSectionRowDarkStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowDarkStyles, {
    right_text: {
      color: config.styles.premiumMembershipColor,
      fontWeight: 'bold',
    },
  }),
);

export const logOutSectionRowLightStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowLightStyles, {
    left_text: {
      color: 'red',
    },
  }),
);

export const logOutSectionRowDarkStyles = StyleSheet.create(
  _.merge({}, defaultSectionRowDarkStyles, {
    left_text: {
      color: 'red',
    },
  }),
);
