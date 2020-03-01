/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as moment from 'moment';

import { FieldState } from '../enums/FieldState';
import {
  VocabularyCategoryRow,
  VocabularyCategoryRowForUpsert,
} from '../interfaces/VocabularyCategoryRow';

export class VocabularyCategoryRowPreparer extends AbstractPreparer<
  VocabularyCategoryRow
> {
  protected upsertRules = {
    vocabularyCategoryLocalId: Joi.forbidden()
      .strip()
      .optional(),
    vocabularyId: Joi.string(),
    categoryName: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    firstSyncedAt: Joi.number().allow(null),
    lastSyncedAt: Joi.number().allow(null),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };

  public prepareUpsert(
    vocabularyCategory: object,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): VocabularyCategoryRowForUpsert;
  public prepareUpsert(
    vocabularyCategory: VocabularyCategory,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): VocabularyCategoryRowForUpsert {
    const vocabularyCategoryRow: VocabularyCategoryRowForUpsert = {
      vocabularyId,
      categoryName: vocabularyCategory.categoryName,
      createdAt:
        source === 'local'
          ? moment().unix()
          : moment(vocabularyCategory.createdAt).unix(),
      updatedAt:
        source === 'local'
          ? moment().unix()
          : moment(vocabularyCategory.updatedAt).unix(),
      firstSyncedAt:
        source === 'local'
          ? null
          : typeof vocabularyCategory.firstSyncedAt !== 'undefined' &&
            vocabularyCategory.firstSyncedAt !== null
          ? moment(vocabularyCategory.firstSyncedAt).unix()
          : vocabularyCategory.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? null
          : typeof vocabularyCategory.lastSyncedAt !== 'undefined' &&
            vocabularyCategory.lastSyncedAt !== null
          ? moment(vocabularyCategory.lastSyncedAt).unix()
          : vocabularyCategory.lastSyncedAt,
      fieldState:
        source === 'remote' ? FieldState.SYNCED : FieldState.TO_BE_SYNCED,
    };

    return _.omitBy(
      this.validateData(vocabularyCategoryRow, this.upsertRules),
      _.isUndefined
    ) as VocabularyCategoryRowForUpsert;
  }
}
