/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface WritingFormTopStyles {
  container: ViewStyle;
  top_container: ViewStyle;
  number_container: ViewStyle;
  number: TextStyle;
  placeholder: ViewStyle;
  button_container: ViewStyle;
  note_container: ViewStyle;
  note: TextStyle;
}

export const baseStyles: WritingFormTopStyles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ss(16),
    marginTop: ss(20),
    marginBottom: ss(20),
  },

  top_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  number_container: {
    height: ss(24),
    paddingHorizontal: ss(16),
    borderRadius: ss(12),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  number: {
    fontSize: ss(15),
    fontWeight: 'bold',
  },

  placeholder: {
    height: ss(24),
    flex: 1,
  },

  button_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  note_container: {
    marginTop: ss(6),
  },

  note: {
    fontSize: ss(14),
    textAlign: 'center',
  },
};

export const lightStyles: WritingFormTopStyles = StyleSheet.create(
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
  }),
);

export const darkStyles: WritingFormTopStyles = StyleSheet.create(
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
  }),
);
