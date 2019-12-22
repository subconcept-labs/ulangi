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

import {
  VocabularyWritingRow,
  VocabularyWritingRowForUpsert,
} from '../interfaces/VocabularyWritingRow';

export class VocabularyWritingRowPreparer extends AbstractPreparer<
  VocabularyWritingRow
> {
  protected upsertRules = {
    userId: Joi.string(),
    vocabularyId: Joi.string(),
    level: Joi.number().optional(),
    lastWrittenAt: Joi.date()
      .allow(null)
      .optional(),
    disabled: Joi.number()
      .valid([0, 1])
      .optional(),
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
    vocabularyWriting: object,
    vocabularyId: string
  ): VocabularyWritingRowForUpsert;
  public prepareUpsert(
    userId: string,
    vocabularyWriting: DeepPartial<VocabularyWriting>,
    vocabularyId: string
  ): VocabularyWritingRowForUpsert {
    const vocabularyWritingData = this.convertToUpsertRow(
      userId,
      vocabularyWriting,
      vocabularyId
    );

    return this.validateData(
      vocabularyWritingData,
      this.upsertRules
    ) as VocabularyWritingRowForUpsert;
  }

  public canPrepareUpsert(
    userId: string,
    vocabularyWriting: object,
    vocabularyId: string
  ): boolean;
  public canPrepareUpsert(
    userId: string,
    vocabularyWriting: DeepPartial<VocabularyWriting>,
    vocabularyId: string
  ): boolean {
    const vocabularyWritingData = this.convertToUpsertRow(
      userId,
      vocabularyWriting,
      vocabularyId
    );

    return this.isValidData(vocabularyWritingData, this.upsertRules);
  }

  private convertToUpsertRow(
    userId: string,
    vocabularyWriting: DeepPartial<VocabularyWriting>,
    vocabularyId: string
  ): DeepPartial<VocabularyWritingRow> {
    const vocabularyWritingData: {
      [P in keyof VocabularyWritingRow]:
        | undefined
        | DeepPartial<VocabularyWritingRow[P]>
    } = {
      userId,
      vocabularyId,
      level: vocabularyWriting.level,
      lastWrittenAt:
        typeof vocabularyWriting.lastWrittenAt !== 'undefined'
          ? vocabularyWriting.lastWrittenAt !== null
            ? (vocabularyWriting.lastWrittenAt as Date)
            : vocabularyWriting.lastWrittenAt
          : undefined,
      disabled:
        typeof vocabularyWriting.disabled !== 'undefined'
          ? vocabularyWriting.disabled === false
            ? 0
            : 1
          : undefined,
      createdAt:
        typeof vocabularyWriting.createdAt !== 'undefined'
          ? vocabularyWriting.createdAt !== null
            ? (vocabularyWriting.createdAt as Date)
            : vocabularyWriting.createdAt
          : undefined,
      updatedAt:
        typeof vocabularyWriting.updatedAt !== 'undefined'
          ? vocabularyWriting.updatedAt !== null
            ? (vocabularyWriting.updatedAt as Date)
            : vocabularyWriting.updatedAt
          : undefined,
      firstSyncedAt: undefined,
      lastSyncedAt: undefined,
    };
    return vocabularyWritingData;
  }
}
