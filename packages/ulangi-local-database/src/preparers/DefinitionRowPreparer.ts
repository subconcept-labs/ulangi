/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { DefinitionStatus } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as moment from 'moment';

import {
  DefinitionRow,
  DefinitionRowForInsert,
  DefinitionRowForUpdate,
} from '../interfaces/DefinitionRow';

export class DefinitionRowPreparer extends AbstractPreparer<DefinitionRow> {
  protected insertRules = {
    definitionLocalId: Joi.forbidden()
      .strip()
      .optional(),
    definitionId: Joi.string(),
    vocabularyId: Joi.string(),
    definitionStatus: Joi.string().valid(_.values(DefinitionStatus)),
    meaning: Joi.string(),
    wordClasses: Joi.string(),
    source: Joi.string(),
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
    definitionLocalId: Joi.forbidden()
      .strip()
      .optional(),
    definitionId: Joi.string(),
    vocabularyId: Joi.string().optional(),
    definitionStatus: Joi.string()
      .valid(_.values(DefinitionStatus))
      .optional(),
    meaning: Joi.string().optional(),
    wordClasses: Joi.string().optional(),
    source: Joi.string().optional(),
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
    definition: object,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): DefinitionRowForInsert;
  public prepareInsert(
    definition: Definition,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): DefinitionRowForInsert {
    return this.validateData(
      this.convertToRowForInsert(definition, vocabularyId, source),
      this.insertRules
    ) as DefinitionRowForInsert;
  }

  public canPrepareInsert(
    definition: object,
    vocabularyId: undefined | string,
    source: 'local' | 'remote'
  ): boolean;
  public canPrepareInsert(
    definition: Definition,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): boolean {
    return this.isValidData(
      this.convertToRowForInsert(definition, vocabularyId, source),
      this.insertRules
    );
  }

  public prepareUpdate(
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string,
    source: 'local' | 'remote'
  ): DefinitionRowForUpdate {
    return _.omitBy(
      this.validateData(
        this.convertToRowForUpdate(definition, vocabularyId, source),
        this.updateRules
      ),
      _.isUndefined
    );
  }

  private convertToRowForInsert(
    definition: object,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): DefinitionRowForInsert;
  private convertToRowForInsert(
    definition: Definition,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): DefinitionRowForInsert {
    const definitionRow: DefinitionRowForInsert = {
      definitionId: definition.definitionId,
      vocabularyId,
      definitionStatus: definition.definitionStatus,
      meaning: definition.meaning,
      wordClasses: JSON.stringify(definition.wordClasses),
      source: definition.source,
      createdAt:
        source === 'local'
          ? moment().unix()
          : moment(definition.createdAt).unix(),
      updatedAt:
        source === 'local'
          ? moment().unix()
          : moment(definition.updatedAt).unix(),
      updatedStatusAt:
        source === 'local'
          ? moment().unix()
          : moment(definition.updatedStatusAt).unix(),
      firstSyncedAt:
        source === 'local'
          ? null
          : typeof definition.firstSyncedAt !== 'undefined' &&
            definition.firstSyncedAt !== null
          ? moment(definition.firstSyncedAt).unix()
          : definition.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? null
          : typeof definition.lastSyncedAt !== 'undefined' &&
            definition.lastSyncedAt !== null
          ? moment(definition.lastSyncedAt).unix()
          : definition.lastSyncedAt,
    };
    return definitionRow;
  }

  public convertToRowForUpdate(
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string,
    source: 'local' | 'remote'
  ): DefinitionRowForUpdate {
    return {
      definitionLocalId: undefined,
      definitionId: definition.definitionId,
      vocabularyId,
      definitionStatus: definition.definitionStatus,
      meaning: definition.meaning,
      wordClasses: JSON.stringify(definition.wordClasses),
      source: definition.source,
      createdAt: undefined,
      updatedAt:
        source === 'local'
          ? moment().unix()
          : definition.updatedAt
          ? moment(definition.updatedAt as Date).unix()
          : definition.updatedAt,
      updatedStatusAt:
        source === 'local' && definition.definitionStatus
          ? moment().unix()
          : definition.updatedStatusAt
          ? moment(definition.updatedStatusAt as Date).unix()
          : definition.updatedStatusAt,
      firstSyncedAt:
        source === 'local'
          ? undefined
          : definition.firstSyncedAt
          ? moment(definition.firstSyncedAt as Date).unix()
          : definition.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? undefined
          : definition.lastSyncedAt
          ? moment(definition.lastSyncedAt as Date).unix()
          : definition.lastSyncedAt,
    };
  }
}
