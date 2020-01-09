/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet } from 'react-native';

import { config } from '../../constants/config';
import {
  darkStyles as defaultDefinitionItemDarkStyles,
  lightStyles as defaultDefinitionItemLightStyles,
} from './DefinitionItem.style';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VocabularyDetailDefinitionsStyles {}

export const baseStyles: VocabularyDetailDefinitionsStyles = {};

export const lightStyles = StyleSheet.create(baseStyles);

export const darkStyles = StyleSheet.create(baseStyles);

export const definitionItemLightStyles = _.merge(
  {},
  defaultDefinitionItemLightStyles,
  {
    item_container: {
      backgroundColor: config.styles.light.primaryBackgroundColor,
      borderTopWidth: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: config.styles.light.primaryBorderColor,
    },
  },
);

export const definitionItemDarkStyles = _.merge(
  {},
  defaultDefinitionItemDarkStyles,
  {
    item_container: {
      backgroundColor: config.styles.dark.primaryBackgroundColor,
      borderTopWidth: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: config.styles.dark.primaryBorderColor,
    },
  },
);
