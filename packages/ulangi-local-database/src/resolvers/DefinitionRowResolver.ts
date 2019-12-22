/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { DefinitionStatus } from '@ulangi/ulangi-common/enums';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { DefinitionRow } from '../interfaces/DefinitionRow';

export class DefinitionRowResolver extends AbstractResolver<DefinitionRow> {
  protected rules = {
    definitionLocalId: Joi.number().allow(null),
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
}
