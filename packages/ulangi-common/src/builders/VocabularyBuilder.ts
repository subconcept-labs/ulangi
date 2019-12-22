/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';

import { DefinitionBuilder } from '../builders/DefinitionBuilder';
import { VocabularyCategoryBuilder } from '../builders/VocabularyCategoryBuilder';
import { VocabularyWritingBuilder } from '../builders/VocabularyWritingBuilder';
import { VocabularyStatus } from '../enums/VocabularyStatus';
import { Definition } from '../interfaces/general/Definition';
import { Vocabulary } from '../interfaces/general/Vocabulary';

export class VocabularyBuilder {
  private definitionBuilder = new DefinitionBuilder();
  private vocabularyCategoryBuilder = new VocabularyCategoryBuilder();
  private vocabularyWritingBuilder = new VocabularyWritingBuilder();

  public build(vocabulary: DeepPartial<Vocabulary>): Vocabulary {
    let definitions: Definition[] = [];
    if (typeof vocabulary.definitions !== 'undefined') {
      definitions = vocabulary.definitions.map(
        (definition): Definition => {
          return this.definitionBuilder.build(definition);
        }
      );
    }

    let category;
    if (typeof vocabulary.category !== 'undefined') {
      category = this.vocabularyCategoryBuilder.build(vocabulary.category);
    }

    let writing;
    if (typeof vocabulary.writing !== 'undefined') {
      writing = this.vocabularyWritingBuilder.build(vocabulary.writing);
    }

    return _.merge(
      {
        vocabularyId: uuid.v4(),
        vocabularyText: '',
        vocabularyStatus: VocabularyStatus.ACTIVE,
        definitions: definitions,
        level: 0,
        lastLearnedAt: null,
        updatedAt: moment.utc().toDate(),
        createdAt: moment.utc().toDate(),
        updatedStatusAt: moment.utc().toDate(),
        firstSyncedAt: null,
        lastSyncedAt: null,
        extraData: [],
        category,
        writing,
      },
      _.omit(vocabulary, 'definitions', 'category', 'writing')
    ); // Removed they're already merged
  }
}
