/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SearchPublicSetsResponse } from '../../interfaces/response/SearchPublicSetsResponse';
import { PublicSetResolver } from '../general/PublicSetResolver';

export class SearchPublicSetsResponseResolver extends AbstractResolver<
  SearchPublicSetsResponse
> {
  private publicSetResolver = new PublicSetResolver();

  protected rules = {
    setList: Joi.array().items(this.publicSetResolver.getRules()),
    nextOffset: Joi.number().allow(null),
  };
}
