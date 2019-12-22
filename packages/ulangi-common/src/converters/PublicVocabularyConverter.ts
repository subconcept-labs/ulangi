/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import * as _ from 'lodash';

import { VocabularyBuilder } from '../builders/VocabularyBuilder';
import { Definition } from '../interfaces/general/Definition';
import { PublicVocabulary } from '../interfaces/general/PublicVocabulary';
import { Vocabulary } from '../interfaces/general/Vocabulary';

export class PublicVocabularyConverter {
  private vocabularyBuilder = new VocabularyBuilder();

  public convertToVocabulary(
    publicVocabulary: PublicVocabulary,
    categoryName?: string
  ): Vocabulary {
    const definitions = publicVocabulary.definitions.map(
      (definition): DeepPartial<Definition> => {
        return {
          meaning: definition.meaning,
          wordClasses: definition.wordClasses,
          source: definition.source,
        };
      }
    );

    const category =
      typeof categoryName !== 'undefined'
        ? { categoryName }
        : typeof _.first(publicVocabulary.categories) !== 'undefined'
        ? { categoryName: _.first(publicVocabulary.categories) }
        : undefined;

    return this.vocabularyBuilder.build({
      vocabularyText: publicVocabulary.vocabularyText,
      definitions,
      category,
    });
  }
}
