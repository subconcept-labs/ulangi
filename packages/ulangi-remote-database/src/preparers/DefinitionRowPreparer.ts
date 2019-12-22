/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { DefinitionStatus } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';

import {
  DefinitionRow,
  DefinitionRowForInsert,
  DefinitionRowForUpdate,
} from '../interfaces/DefinitionRow';

export class DefinitionRowPreparer extends AbstractPreparer<DefinitionRow> {
  protected insertRules = {
    userId: Joi.string(),
    definitionId: Joi.string(),
    vocabularyId: Joi.string(),
    definitionStatus: Joi.string().valid(_.values(DefinitionStatus)),
    meaning: Joi.string(),
    wordClasses: Joi.string(), // wordclasses is stored as a JSON string not array
    source: Joi.string(),
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
    definitionId: Joi.string(),
    vocabularyId: Joi.string().optional(),
    definitionStatus: Joi.string()
      .valid(_.values(DefinitionStatus))
      .optional(),
    meaning: Joi.string().optional(),
    wordClasses: Joi.string().optional(),
    source: Joi.string().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    updatedStatusAt: Joi.date().optional(),
    firstSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
    lastSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  // Definition can be any objec as long as it satified the rules
  public prepareInsert(
    userId: string,
    definition: object,
    vocabularyId: string
  ): DefinitionRowForInsert;
  public prepareInsert(
    userId: string,
    definition: Definition,
    vocabularyId: string
  ): DefinitionRowForInsert {
    const definitionRow = this.convertToInsertRow(
      userId,
      definition,
      vocabularyId
    );

    return this.validateData(
      definitionRow,
      this.insertRules
    ) as DefinitionRowForInsert;
  }

  public prepareUpdate(
    userId: string,
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string
  ): DefinitionRowForUpdate {
    const definitionRow = this.convertToUpdateRow(
      userId,
      definition,
      vocabularyId
    );

    return _.omitBy(
      this.validateData(definitionRow, this.updateRules),
      _.isUndefined
    );
  }

  public canPrepareInsert(
    userId: string,
    definition: object,
    vocabularyId: undefined | string
  ): boolean;
  public canPrepareInsert(
    userId: string,
    definition: Definition,
    vocabularyId: string
  ): boolean {
    const definitionRow = this.convertToInsertRow(
      userId,
      definition,
      vocabularyId
    );

    return this.isValidData(definitionRow, this.insertRules);
  }

  public canPrepareUpdate(
    userId: string,
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string
  ): boolean {
    const definitionRow = this.convertToUpdateRow(
      userId,
      definition,
      vocabularyId
    );

    return this.isValidData(definitionRow, this.updateRules);
  }

  private convertToInsertRow(
    userId: string,
    definition: Definition,
    vocabularyId: string
  ): DefinitionRowForInsert {
    const definitionRow: Omit<
      { [P in keyof DefinitionRow]: DefinitionRow[P] },
      'firstSyncedAt' | 'lastSyncedAt'
    > = {
      userId,
      definitionId: definition.definitionId,
      vocabularyId,
      definitionStatus: definition.definitionStatus,
      meaning: definition.meaning,
      wordClasses: JSON.stringify(definition.wordClasses),
      source: definition.source,
      createdAt: definition.createdAt,
      updatedAt: definition.updatedAt,
      updatedStatusAt: definition.updatedStatusAt,
    };

    return definitionRow;
  }

  private convertToUpdateRow(
    userId: string,
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string
  ): DefinitionRowForUpdate {
    const definitionRow: {
      [P in keyof DefinitionRowForUpdate]:
        | undefined
        | DeepPartial<DefinitionRowForUpdate[P]>
    } = {
      userId,
      definitionId: definition.definitionId,
      vocabularyId,
      definitionStatus: definition.definitionStatus,
      meaning: definition.meaning,
      wordClasses:
        typeof definition.wordClasses !== 'undefined'
          ? JSON.stringify(definition.wordClasses)
          : definition.wordClasses,
      source: definition.source,
      createdAt: definition.createdAt,
      updatedAt: definition.updatedAt,
      updatedStatusAt: definition.updatedStatusAt,
      firstSyncedAt: undefined,
      lastSyncedAt: undefined,
    };

    return definitionRow;
  }
}
