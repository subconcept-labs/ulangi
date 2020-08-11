/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { StyleSheet } from 'react-native';

import { config } from '../../constants/config';
import { ResponsiveStyleSheet } from '../../utils/responsive';
import {
  DefinitionItemResponsiveStyles,
  DefinitionItemStyles,
} from './DefinitionItem.style';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VocabularyDetailDefinitionsStyles {}

export class VocabularyDetailDefinitionsResponsiveStyles extends ResponsiveStyleSheet<
  VocabularyDetailDefinitionsStyles
> {
  public baseStyles(): VocabularyDetailDefinitionsStyles {
    return {};
  }

  public lightStyles(): Partial<VocabularyDetailDefinitionsStyles> {
    return {};
  }

  public darkStyles(): Partial<VocabularyDetailDefinitionsStyles> {
    return {};
  }
}

export class ExtendedDefinitionItemResponsiveStyles extends DefinitionItemResponsiveStyles {
  public lightStyles(): Partial<DefinitionItemStyles> {
    return _.merge({}, super.lightStyles(), {
      item_container: {
        backgroundColor: config.styles.light.primaryBackgroundColor,
        borderTopWidth: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: config.styles.light.primaryBorderColor,
      },
    });
  }

  public darkStyles(): Partial<DefinitionItemStyles> {
    return _.merge({}, super.darkStyles(), {
      item_container: {
        backgroundColor: config.styles.dark.primaryBackgroundColor,
        borderTopWidth: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: config.styles.dark.primaryBorderColor,
      },
    });
  }
}

export const vocabularyDetailDefinitionsResponsiveStyles = new VocabularyDetailDefinitionsResponsiveStyles();

export const definitionItemResponsiveStyles = new ExtendedDefinitionItemResponsiveStyles();
