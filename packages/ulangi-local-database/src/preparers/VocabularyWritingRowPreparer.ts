/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { VocabularyWriting } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as moment from 'moment';

import {
  VocabularyWritingRow,
  VocabularyWritingRowForUpsert,
} from '../interfaces/VocabularyWritingRow';

export class VocabularyWritingRowPreparer extends AbstractPreparer<
  VocabularyWritingRow
> {
  protected upsertRules = {
    vocabularyWritingLocalId: Joi.forbidden()
      .strip()
      .optional(),
    vocabularyId: Joi.string(),
    lastWrittenAt: Joi.number()
      .allow(null)
      .optional(),
    level: Joi.number().optional(),
    disabled: Joi.number()
      .valid([0, 1])
      .optional(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    firstSyncedAt: Joi.number().allow(null),
    lastSyncedAt: Joi.number().allow(null),
  };

  public prepareUpsert(
    vocabularyWriting: object,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): VocabularyWritingRowForUpsert;
  public prepareUpsert(
    vocabularyWriting: DeepPartial<VocabularyWriting>,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): VocabularyWritingRowForUpsert {
    const vocabularyWritingRow: VocabularyWritingRowForUpsert = {
      vocabularyWritingLocalId: undefined,
      vocabularyId,
      level: vocabularyWriting.level,
      disabled:
        typeof vocabularyWriting.disabled !== 'undefined'
          ? vocabularyWriting.disabled === true
            ? 1
            : 0
          : undefined,
      lastWrittenAt:
        typeof vocabularyWriting.lastWrittenAt !== 'undefined'
          ? vocabularyWriting.lastWrittenAt !== null
            ? moment(vocabularyWriting.lastWrittenAt as Date).unix()
            : null
          : undefined,
      createdAt:
        source === 'local'
          ? moment().unix()
          : typeof vocabularyWriting.createdAt !== 'undefined'
          ? moment(vocabularyWriting.createdAt as Date).unix()
          : undefined,
      updatedAt:
        source === 'local'
          ? moment().unix()
          : typeof vocabularyWriting.updatedAt !== 'undefined'
          ? moment(vocabularyWriting.updatedAt as Date).unix()
          : undefined,
      firstSyncedAt:
        source === 'local'
          ? null
          : typeof vocabularyWriting.firstSyncedAt !== 'undefined' &&
            vocabularyWriting.firstSyncedAt !== null
          ? moment(vocabularyWriting.firstSyncedAt as Date).unix()
          : vocabularyWriting.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? null
          : typeof vocabularyWriting.lastSyncedAt !== 'undefined' &&
            vocabularyWriting.lastSyncedAt !== null
          ? moment(vocabularyWriting.lastSyncedAt as Date).unix()
          : vocabularyWriting.lastSyncedAt,
    };

    return _.omitBy(
      this.validateData(vocabularyWritingRow, this.upsertRules),
      _.isUndefined
    );
  }
}
