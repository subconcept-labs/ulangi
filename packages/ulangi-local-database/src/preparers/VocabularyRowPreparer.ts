/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as moment from 'moment';

import {
  VocabularyRow,
  VocabularyRowForInsert,
  VocabularyRowForUpdate,
} from '../interfaces/VocabularyRow';

export class VocabularyRowPreparer extends AbstractPreparer<VocabularyRow> {
  protected insertRules = {
    vocabularyLocalId: Joi.forbidden()
      .strip()
      .optional(),
    vocabularyId: Joi.string(),
    setId: Joi.string(),
    vocabularyText: Joi.string(),
    vocabularyStatus: Joi.string().valid(_.values(VocabularyStatus)),
    lastLearnedAt: Joi.number()
      .integer()
      .allow(null),
    level: Joi.number().integer(),
    createdAt: Joi.number().integer(),
    updatedAt: Joi.number().integer(),
    updatedStatusAt: Joi.number().integer(),
    firstSyncedAt: Joi.number()
      .integer()
      .allow(null),
    lastSyncedAt: Joi.number()
      .integer()
      .allow(null),
  };

  protected updateRules = {
    vocabularyLocalId: Joi.forbidden()
      .strip()
      .optional(),
    vocabularyId: Joi.string(),
    setId: Joi.string().optional(),
    vocabularyText: Joi.string().optional(),
    vocabularyStatus: Joi.string()
      .valid(_.values(VocabularyStatus))
      .optional(),
    lastLearnedAt: Joi.number()
      .allow(null)
      .optional(),
    level: Joi.number()
      .integer()
      .optional(),
    createdAt: Joi.forbidden()
      .strip()
      .optional(),
    updatedAt: Joi.number()
      .integer()
      .optional(),
    updatedStatusAt: Joi.number()
      .integer()
      .optional(),
    firstSyncedAt: Joi.number()
      .integer()
      .allow(null)
      .optional(),
    lastSyncedAt: Joi.number()
      .integer()
      .allow(null)
      .optional(),
  };

  public prepareInsert(
    vocabulary: object,
    setId: string,
    source: 'local' | 'remote'
  ): VocabularyRowForInsert;
  public prepareInsert(
    vocabulary: Vocabulary,
    setId: string,
    source: 'local' | 'remote'
  ): VocabularyRowForInsert {
    const vocabularyData: VocabularyRowForInsert = {
      vocabularyId: vocabulary.vocabularyId,
      setId,
      vocabularyText: vocabulary.vocabularyText,
      vocabularyStatus: vocabulary.vocabularyStatus,
      lastLearnedAt:
        typeof vocabulary.lastLearnedAt !== 'undefined' &&
        vocabulary.lastLearnedAt !== null
          ? moment(vocabulary.lastLearnedAt).unix()
          : vocabulary.lastLearnedAt,
      level: vocabulary.level,
      createdAt:
        source === 'local'
          ? moment().unix()
          : moment(vocabulary.createdAt).unix(),
      updatedAt:
        source === 'local'
          ? moment().unix()
          : moment(vocabulary.updatedAt).unix(),
      updatedStatusAt:
        source === 'local'
          ? moment().unix()
          : moment(vocabulary.updatedStatusAt).unix(),
      firstSyncedAt:
        source === 'local'
          ? null
          : typeof vocabulary.firstSyncedAt !== 'undefined' &&
            vocabulary.firstSyncedAt !== null
          ? moment(vocabulary.firstSyncedAt).unix()
          : vocabulary.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? null
          : typeof vocabulary.lastSyncedAt !== 'undefined' &&
            vocabulary.lastSyncedAt !== null
          ? moment(vocabulary.lastSyncedAt).unix()
          : vocabulary.lastSyncedAt,
    };

    return this.validateData(
      vocabularyData,
      this.insertRules
    ) as VocabularyRowForInsert;
  }

  public prepareUpdate(
    vocabulary: DeepPartial<Vocabulary>,
    setId: undefined | string,
    source: 'local' | 'remote'
  ): VocabularyRowForUpdate {
    const vocabularyData: VocabularyRowForUpdate = {
      vocabularyLocalId: undefined,
      vocabularyId: vocabulary.vocabularyId,
      setId,
      vocabularyText: vocabulary.vocabularyText,
      vocabularyStatus: vocabulary.vocabularyStatus,
      lastLearnedAt: vocabulary.lastLearnedAt
        ? moment.utc(vocabulary.lastLearnedAt as Date).unix()
        : vocabulary.lastLearnedAt,
      level: vocabulary.level,
      createdAt: undefined,
      updatedAt:
        source === 'local'
          ? moment().unix()
          : vocabulary.updatedAt
          ? moment(vocabulary.updatedAt as Date).unix()
          : vocabulary.updatedAt,
      updatedStatusAt:
        source === 'local' && typeof vocabulary.vocabularyStatus !== 'undefined'
          ? moment().unix()
          : vocabulary.updatedStatusAt
          ? moment(vocabulary.updatedStatusAt as Date).unix()
          : vocabulary.updatedStatusAt,
      firstSyncedAt:
        source === 'local'
          ? undefined
          : vocabulary.firstSyncedAt
          ? moment(vocabulary.firstSyncedAt as Date).unix()
          : vocabulary.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? undefined
          : vocabulary.lastSyncedAt
          ? moment(vocabulary.lastSyncedAt as Date).unix()
          : vocabulary.lastSyncedAt,
    };

    return _.omitBy(
      this.validateData(vocabularyData, this.updateRules),
      _.isUndefined
    );
  }
}
