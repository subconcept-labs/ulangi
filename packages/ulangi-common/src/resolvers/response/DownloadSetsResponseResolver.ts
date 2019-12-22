/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { DownloadSetsResponse } from '../../interfaces/response/DownloadSetsResponse';
import { SetResolver } from '../general/SetResolver';

export class DownloadSetsResponseResolver extends AbstractResolver<
  DownloadSetsResponse
> {
  protected setResolver = new SetResolver();

  protected rules = {
    setList: Joi.array().items(this.setResolver.getRules()),
    noMore: Joi.boolean(),
  };
}
