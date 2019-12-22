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

import {
  VocabularyRow,
  VocabularyRowForInsert,
  VocabularyRowForUpdate,
} from '../interfaces/VocabularyRow';

export class VocabularyRowPreparer extends AbstractPreparer<VocabularyRow> {
  protected insertRules = {
    userId: Joi.string(),
    vocabularyId: Joi.string(),
    setId: Joi.string(),
    vocabularyStatus: Joi.string().valid(_.values(VocabularyStatus)),
    vocabularyText: Joi.string(),
    level: Joi.number(),
    lastLearnedAt: Joi.date().allow(null),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    updatedStatusAt: Joi.date(),
    firstSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
    lastSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  protected updateRules = {
    userId: Joi.string(),
    vocabularyId: Joi.string(),
    setId: Joi.string().optional(),
    vocabularyStatus: Joi.string()
      .valid(_.values(VocabularyStatus))
      .optional(),
    vocabularyText: Joi.string().optional(),
    level: Joi.number().optional(),
    createdAt: Joi.date().optional(),
    lastLearnedAt: Joi.date()
      .allow(null)
      .optional(),
    updatedAt: Joi.date().optional(),
    updatedStatusAt: Joi.date().optional(),
    firstSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
    lastSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  public prepareInsert(
    userId: string,
    vocabulary: object,
    setId: string
  ): VocabularyRowForInsert;
  public prepareInsert(
    userId: string,
    vocabulary: Vocabulary,
    setId: string
  ): VocabularyRowForInsert {
    const vocabularyRow = this.convertToInsertRow(userId, vocabulary, setId);

    return this.validateData(
      vocabularyRow,
      this.insertRules
    ) as VocabularyRowForInsert;
  }

  public prepareUpdate(
    userId: string,
    vocabulary: DeepPartial<Vocabulary>,
    setId: undefined | string
  ): VocabularyRowForUpdate {
    const vocabularyRow = this.convertToUpdateRow(userId, vocabulary, setId);

    return _.omitBy(
      this.validateData(vocabularyRow, this.updateRules),
      _.isUndefined
    );
  }

  public canPrepareInsert(
    userId: string,
    vocabulary: DeepPartial<Vocabulary>,
    setId: undefined | string
  ): boolean;
  public canPrepareInsert(
    userId: string,
    vocabulary: Vocabulary,
    setId: string
  ): boolean {
    const vocabularyRow = this.convertToInsertRow(userId, vocabulary, setId);
    return this.isValidData(vocabularyRow, this.insertRules);
  }

  public canPrepareUpdate(
    userId: string,
    vocabulary: DeepPartial<Vocabulary>,
    setId: undefined | string
  ): boolean {
    const vocabularyRow = this.convertToUpdateRow(userId, vocabulary, setId);
    return this.isValidData(vocabularyRow, this.updateRules);
  }

  private convertToInsertRow(
    userId: string,
    vocabulary: Vocabulary,
    setId: string
  ): DeepPartial<VocabularyRow> {
    const vocabularyRow: VocabularyRowForInsert = {
      userId,
      vocabularyId: vocabulary.vocabularyId,
      setId,
      vocabularyStatus: vocabulary.vocabularyStatus,
      vocabularyText: vocabulary.vocabularyText,
      level: vocabulary.level,
      lastLearnedAt: vocabulary.lastLearnedAt,
      createdAt: vocabulary.createdAt,
      updatedAt: vocabulary.updatedAt,
      updatedStatusAt: vocabulary.updatedStatusAt,
    };
    return vocabularyRow;
  }

  private convertToUpdateRow(
    userId: string,
    vocabulary: DeepPartial<Vocabulary>,
    setId: undefined | string
  ): VocabularyRowForUpdate {
    const vocabularyRow: {
      [P in keyof VocabularyRowForUpdate]:
        | undefined
        | DeepPartial<VocabularyRowForUpdate[P]>
    } = {
      userId,
      vocabularyId: vocabulary.vocabularyId,
      setId,
      vocabularyStatus: vocabulary.vocabularyStatus,
      vocabularyText: vocabulary.vocabularyText,
      level: vocabulary.level,
      lastLearnedAt: vocabulary.lastLearnedAt,
      createdAt: vocabulary.createdAt,
      updatedAt: vocabulary.updatedAt,
      updatedStatusAt: vocabulary.updatedStatusAt,
      firstSyncedAt: undefined,
      lastSyncedAt: undefined,
    };
    return vocabularyRow;
  }
}
