/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SearchNativeSetsResponse } from '../../interfaces/response/SearchNativeSetsResponse';
import { NativeSetResolver } from '../general/NativeSetResolver';

export class SearchNativeSetsResponseResolver extends AbstractResolver<
  SearchNativeSetsResponse
> {
  private nativeSetResolver = new NativeSetResolver();
  protected rules = {
    setList: Joi.array().items(this.nativeSetResolver.getRules()),
  };
}
