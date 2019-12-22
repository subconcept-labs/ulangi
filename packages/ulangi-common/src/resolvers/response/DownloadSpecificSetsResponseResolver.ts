/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { DownloadSpecificSetsResponse } from '../../interfaces/response/DownloadSpecificSetsResponse';
import { SetResolver } from '../general/SetResolver';

export class DownloadSpecificSetsResponseResolver extends AbstractResolver<
  DownloadSpecificSetsResponse
> {
  protected setResolver = new SetResolver();

  protected rules = {
    setList: Joi.array().items(this.setResolver.getRules()),
  };
}
