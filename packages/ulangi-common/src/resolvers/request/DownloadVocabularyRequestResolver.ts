/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { DownloadVocabularyRequest } from '../../interfaces/request/DownloadVocabularyRequest';
import { RequestResolver } from './RequestResolver';

export class DownloadVocabularyRequestResolver extends RequestResolver<
  DownloadVocabularyRequest
> {
  protected rules = {
    query: {
      startAt: Joi.date().optional(),
      softLimit: Joi.number(),
      setId: Joi.string().optional(),
    },
    body: Joi.strip(),
  };
}
