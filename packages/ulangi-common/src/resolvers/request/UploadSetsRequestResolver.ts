/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { UploadSetsRequest } from '../../interfaces/request/UploadSetsRequest';
import { SetResolver } from '../general/SetResolver';
import { RequestResolver } from './RequestResolver';

export class UploadSetsRequestResolver extends RequestResolver<
  UploadSetsRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      setList: Joi.array()
        .items(new SetResolver().getRules())
        .options({ presence: 'optional' }),
    },
  };
}
