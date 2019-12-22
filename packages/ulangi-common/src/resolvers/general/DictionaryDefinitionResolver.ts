/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { WordClass } from '../../enums/WordClass';
import { DictionaryDefinition } from '../../interfaces/general/DictionaryDefinition';

export class DictionaryDefinitionResolver extends AbstractResolver<
  DictionaryDefinition
> {
  protected rules = {
    wordClasses: Joi.array().items(_.values(WordClass)),
    meaning: Joi.string(),
    source: Joi.string(),
  };
}
