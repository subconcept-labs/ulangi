/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { DefinitionStatus } from '../../enums/DefinitionStatus';
import { WordClass } from '../../enums/WordClass';
import { Definition } from '../../interfaces/general/Definition';

export class DefinitionResolver extends AbstractResolver<Definition> {
  protected rules = {
    definitionId: Joi.string(),
    meaning: Joi.string(),
    wordClasses: Joi.array().items(_.values(WordClass)),
    definitionStatus: Joi.string().valid(_.values(DefinitionStatus)),
    source: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    updatedStatusAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
    extraData: Joi.array(),
  };
}
