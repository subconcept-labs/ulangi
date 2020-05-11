/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { DictionaryEntryResolver } from '@ulangi/wiktionary-core';
import * as Joi from 'joi';

import { GetDictionaryEntryResponse } from '../../interfaces/response/GetDictionaryEntryResponse';

export class GetDictionaryEntryResponseResolver extends AbstractResolver<
  GetDictionaryEntryResponse
> {
  private dictionaryEntryResolver = new DictionaryEntryResolver();

  protected rules = {
    dictionaryEntry: this.dictionaryEntryResolver.getRules(),
    traditionalEntry: Joi.object(
      this.dictionaryEntryResolver.getRules()
    ).optional(),
    masculineEntry: Joi.object(
      this.dictionaryEntryResolver.getRules()
    ).optional(),
  };
}
