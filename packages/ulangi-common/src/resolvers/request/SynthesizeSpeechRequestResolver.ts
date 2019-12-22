/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { SynthesizeSpeechRequest } from '../../interfaces/request/SynthesizeSpeechRequest';
import { RequestResolver } from './RequestResolver';

export class SynthesizeSpeechRequestResolver extends RequestResolver<
  SynthesizeSpeechRequest
> {
  protected rules = {
    query: {
      text: Joi.string(),
      languageCode: Joi.string(),
    },
    body: Joi.strip(),
  };
}
