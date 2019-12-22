/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { VocabularyWriting } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';

import { VocabularyWritingRow } from '../interfaces/VocabularyWritingRow';

export class VocabularyWritingRowConverter {
  public convertToVocabularyWriting(
    vocabularyWritingRow: VocabularyWritingRow
  ): VocabularyWriting {
    return {
      lastWrittenAt:
        vocabularyWritingRow.lastWrittenAt !== null
          ? moment.unix(vocabularyWritingRow.lastWrittenAt).toDate()
          : null,
      level: vocabularyWritingRow.level,
      disabled: vocabularyWritingRow.disabled === 1 ? true : false,
      createdAt: moment.unix(vocabularyWritingRow.createdAt).toDate(),
      updatedAt: moment.unix(vocabularyWritingRow.updatedAt).toDate(),
      firstSyncedAt:
        vocabularyWritingRow.firstSyncedAt !== null
          ? moment.unix(vocabularyWritingRow.firstSyncedAt).toDate()
          : null,
      lastSyncedAt:
        vocabularyWritingRow.lastSyncedAt !== null
          ? moment.unix(vocabularyWritingRow.lastSyncedAt).toDate()
          : null,
    };
  }

  public convertToPartialVocabularyWriting(
    vocabularyWritingRow: DeepPartial<VocabularyWritingRow>
  ): DeepPartial<VocabularyWriting> {
    return _.omitBy(
      {
        lastWrittenAt:
          typeof vocabularyWritingRow.lastWrittenAt !== 'undefined'
            ? vocabularyWritingRow.lastWrittenAt !== null
              ? moment.unix(vocabularyWritingRow.lastWrittenAt).toDate()
              : null
            : undefined,
        level: vocabularyWritingRow.level,
        disabled:
          typeof vocabularyWritingRow.disabled !== 'undefined'
            ? vocabularyWritingRow.disabled === 1
              ? true
              : false
            : undefined,
        createdAt:
          typeof vocabularyWritingRow.createdAt !== 'undefined' &&
          vocabularyWritingRow.createdAt !== null
            ? moment.unix(vocabularyWritingRow.createdAt).toDate()
            : vocabularyWritingRow.createdAt,
        updatedAt:
          typeof vocabularyWritingRow.updatedAt !== 'undefined' &&
          vocabularyWritingRow.updatedAt !== null
            ? moment.unix(vocabularyWritingRow.updatedAt).toDate()
            : vocabularyWritingRow.updatedAt,
        firstSyncedAt:
          typeof vocabularyWritingRow.firstSyncedAt !== 'undefined' &&
          vocabularyWritingRow.firstSyncedAt !== null
            ? moment.unix(vocabularyWritingRow.firstSyncedAt).toDate()
            : vocabularyWritingRow.firstSyncedAt,
        lastSyncedAt:
          typeof vocabularyWritingRow.lastSyncedAt !== 'undefined' &&
          vocabularyWritingRow.lastSyncedAt !== null
            ? moment.unix(vocabularyWritingRow.lastSyncedAt).toDate()
            : vocabularyWritingRow.lastSyncedAt,
      },
      _.isUndefined
    );
  }
}
