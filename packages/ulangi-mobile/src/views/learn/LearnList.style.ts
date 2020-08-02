/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface LearnListStyles {
  scroll_view_container: ViewStyle;
  learn_item: ViewStyle;
  spaced_repetition_title_container: ViewStyle;
  writing_title_container: ViewStyle;
  quiz_title_container: ViewStyle;
  reflex_title_container: ViewStyle;
  atom_title_container: ViewStyle;
}

export const baseStyles: LearnListStyles = {
  scroll_view_container: {
    paddingBottom: ss(16),
  },

  learn_item: {
    backgroundColor: '#fff',
    borderRadius: ss(10),
    marginTop: ss(16),
    height: ss(180),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.3 },
    shadowRadius: 0.75,
    shadowOpacity: 0.18,
  },

  spaced_repetition_title_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  writing_title_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  quiz_title_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  reflex_title_container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B8A9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.5,
    shadowOpacity: 0.25,
    elevation: 0.5,
  },

  atom_title_container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: config.atom.backgroundColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.5,
    shadowOpacity: 0.25,
    elevation: 0.5,
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    learn_item: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      elevation: 1,
    },
  }),
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    learn_item: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      elevation: 3,
    },
  }),
);
