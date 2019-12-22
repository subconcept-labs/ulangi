/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import {
  Definition,
  Vocabulary,
  VocabularyCategory,
  VocabularyWriting,
} from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';

import { VocabularyRow } from '../interfaces/VocabularyRow';

export class VocabularyRowConverter {
  public convertToVocabulary(
    vocabularyRow: VocabularyRow,
    definitions: readonly Definition[],
    vocabularyCategory: undefined | VocabularyCategory,
    vocabularyWriting: undefined | VocabularyWriting,
    extraData: any[]
  ): Vocabulary {
    return {
      vocabularyId: vocabularyRow.vocabularyId,
      vocabularyStatus: vocabularyRow.vocabularyStatus,
      vocabularyText: vocabularyRow.vocabularyText,
      definitions: definitions,
      category: vocabularyCategory,
      writing: vocabularyWriting,
      lastLearnedAt:
        vocabularyRow.lastLearnedAt !== null
          ? moment.unix(vocabularyRow.lastLearnedAt).toDate()
          : null,
      level: vocabularyRow.level,
      createdAt: moment.unix(vocabularyRow.createdAt).toDate(),
      updatedAt: moment.unix(vocabularyRow.updatedAt).toDate(),
      updatedStatusAt: moment.unix(vocabularyRow.updatedStatusAt).toDate(),
      firstSyncedAt:
        vocabularyRow.firstSyncedAt !== null
          ? moment.unix(vocabularyRow.firstSyncedAt).toDate()
          : vocabularyRow.firstSyncedAt,
      lastSyncedAt:
        vocabularyRow.lastSyncedAt !== null
          ? moment.unix(vocabularyRow.lastSyncedAt).toDate()
          : vocabularyRow.lastSyncedAt,
      extraData,
    };
  }

  public convertToPartialVocabulary(
    vocabularyRow: DeepPartial<VocabularyRow>,
    definitions: undefined | readonly DeepPartial<Definition>[],
    vocabularyCategory: undefined | DeepPartial<VocabularyCategory>,
    vocabularyWriting: undefined | DeepPartial<VocabularyWriting>,
    extraData: undefined | any[]
  ): DeepPartial<Vocabulary> {
    return _.omitBy(
      {
        vocabularyId: vocabularyRow.vocabularyId,
        vocabularyStatus: vocabularyRow.vocabularyStatus,
        vocabularyText: vocabularyRow.vocabularyText,
        definitions: definitions,
        category: vocabularyCategory,
        writing: vocabularyWriting,
        lastLearnedAt:
          typeof vocabularyRow.lastLearnedAt !== 'undefined' &&
          vocabularyRow.lastLearnedAt !== null
            ? moment.unix(vocabularyRow.lastLearnedAt).toDate()
            : vocabularyRow.lastLearnedAt,
        level: vocabularyRow.level,
        createdAt:
          typeof vocabularyRow.createdAt !== 'undefined' &&
          vocabularyRow.createdAt !== null
            ? moment.unix(vocabularyRow.createdAt).toDate()
            : vocabularyRow.createdAt,
        updatedAt:
          typeof vocabularyRow.updatedAt !== 'undefined' &&
          vocabularyRow.updatedAt !== null
            ? moment.unix(vocabularyRow.updatedAt).toDate()
            : vocabularyRow.updatedAt,
        updatedStatusAt:
          typeof vocabularyRow.updatedStatusAt !== 'undefined' &&
          vocabularyRow.updatedStatusAt !== null
            ? moment.unix(vocabularyRow.updatedStatusAt).toDate()
            : vocabularyRow.updatedStatusAt,
        firstSyncedAt:
          typeof vocabularyRow.firstSyncedAt !== 'undefined' &&
          vocabularyRow.firstSyncedAt !== null
            ? moment.unix(vocabularyRow.firstSyncedAt).toDate()
            : vocabularyRow.firstSyncedAt,
        lastSyncedAt:
          typeof vocabularyRow.lastSyncedAt !== 'undefined' &&
          vocabularyRow.lastSyncedAt !== null
            ? moment.unix(vocabularyRow.lastSyncedAt).toDate()
            : vocabularyRow.lastSyncedAt,
        extraData,
      },
      _.isUndefined
    );
  }
}
