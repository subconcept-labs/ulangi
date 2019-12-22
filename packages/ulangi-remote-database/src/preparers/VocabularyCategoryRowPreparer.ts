/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';

import {
  VocabularyCategoryRow,
  VocabularyCategoryRowForUpsert,
} from '../interfaces/VocabularyCategoryRow';

export class VocabularyCategoryRowPreparer extends AbstractPreparer<
  VocabularyCategoryRow
> {
  protected upsertRules = {
    userId: Joi.string(),
    vocabularyId: Joi.string(),
    categoryName: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
    lastSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  public prepareUpsert(
    userId: string,
    vocabularyCategory: object,
    vocabularyId: string
  ): VocabularyCategoryRowForUpsert;
  public prepareUpsert(
    userId: string,
    vocabularyCategory: VocabularyCategory,
    vocabularyId: string
  ): VocabularyCategoryRowForUpsert {
    const vocabularyCategoryRow = this.convertToUpsertRow(
      userId,
      vocabularyCategory,
      vocabularyId
    );

    return this.validateData(
      vocabularyCategoryRow,
      this.upsertRules
    ) as VocabularyCategoryRowForUpsert;
  }

  public canPrepareUpsert(
    userId: string,
    vocabularyCategory: object,
    vocabularyId: string
  ): boolean;
  public canPrepareUpsert(
    userId: string,
    vocabularyCategory: VocabularyCategory,
    vocabularyId: string
  ): boolean {
    const vocabularyCategoryRow = this.convertToUpsertRow(
      userId,
      vocabularyCategory,
      vocabularyId
    );

    return this.isValidData(vocabularyCategoryRow, this.upsertRules);
  }

  private convertToUpsertRow(
    userId: string,
    vocabularyCategory: VocabularyCategory,
    vocabularyId: string
  ): VocabularyCategoryRowForUpsert {
    const vocabularyCategoryRow: VocabularyCategoryRowForUpsert = {
      userId,
      vocabularyId,
      categoryName: vocabularyCategory.categoryName,
      createdAt: vocabularyCategory.createdAt,
      updatedAt: vocabularyCategory.updatedAt,
    };

    return vocabularyCategoryRow;
  }
}
