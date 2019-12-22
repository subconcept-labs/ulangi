/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';

export interface MultipleChoiceFormTopStyles {
  container: ViewStyle;
  number_container: ViewStyle;
  number: TextStyle;
  note_container: ViewStyle;
  note: TextStyle;
}

export const baseStyles: MultipleChoiceFormTopStyles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },

  number_container: {
    height: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  number: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  note_container: {
    marginTop: 6,
  },

  note: {
    fontSize: 14,
    textAlign: 'center',
  },
};

export const lightStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    number_container: {
      borderColor: config.styles.light.secondaryTextColor,
    },

    number: {
      color: config.styles.light.secondaryTextColor,
    },

    note: {
      color: config.styles.light.secondaryTextColor,
    },
  })
);

export const darkStyles = StyleSheet.create(
  _.merge({}, baseStyles, {
    number_container: {
      borderColor: config.styles.dark.secondaryTextColor,
    },

    number: {
      color: config.styles.dark.secondaryTextColor,
    },

    note: {
      color: config.styles.dark.secondaryTextColor,
    },
  })
);
