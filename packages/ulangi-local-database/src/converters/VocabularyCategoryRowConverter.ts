/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';

import { VocabularyCategoryRow } from '../interfaces/VocabularyCategoryRow';

export class VocabularyCategoryRowConverter {
  public convertToVocabularyCategory(
    vocabularyCategoryRow: VocabularyCategoryRow
  ): VocabularyCategory {
    return {
      categoryName: vocabularyCategoryRow.categoryName,
      createdAt: moment.unix(vocabularyCategoryRow.createdAt).toDate(),
      updatedAt: moment.unix(vocabularyCategoryRow.updatedAt).toDate(),
      firstSyncedAt:
        vocabularyCategoryRow.firstSyncedAt !== null
          ? moment.unix(vocabularyCategoryRow.firstSyncedAt).toDate()
          : null,
      lastSyncedAt:
        vocabularyCategoryRow.lastSyncedAt !== null
          ? moment.unix(vocabularyCategoryRow.lastSyncedAt).toDate()
          : null,
    };
  }

  public convertToPartialVocabularyCategory(
    vocabularyCategoryRow: DeepPartial<VocabularyCategoryRow>
  ): DeepPartial<VocabularyCategory> {
    return _.omitBy(
      {
        categoryName: vocabularyCategoryRow.categoryName,
        createdAt:
          typeof vocabularyCategoryRow.createdAt !== 'undefined' &&
          vocabularyCategoryRow.createdAt !== null
            ? moment.unix(vocabularyCategoryRow.createdAt).toDate()
            : vocabularyCategoryRow.createdAt,
        updatedAt:
          typeof vocabularyCategoryRow.updatedAt !== 'undefined' &&
          vocabularyCategoryRow.updatedAt !== null
            ? moment.unix(vocabularyCategoryRow.updatedAt).toDate()
            : vocabularyCategoryRow.updatedAt,
        firstSyncedAt:
          typeof vocabularyCategoryRow.firstSyncedAt !== 'undefined' &&
          vocabularyCategoryRow.firstSyncedAt !== null
            ? moment.unix(vocabularyCategoryRow.firstSyncedAt).toDate()
            : vocabularyCategoryRow.firstSyncedAt,
        lastSyncedAt:
          typeof vocabularyCategoryRow.lastSyncedAt !== 'undefined' &&
          vocabularyCategoryRow.lastSyncedAt !== null
            ? moment.unix(vocabularyCategoryRow.lastSyncedAt).toDate()
            : vocabularyCategoryRow.lastSyncedAt,
      },
      _.isUndefined
    );
  }
}
