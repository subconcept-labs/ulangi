/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { DownloadSpecificVocabularyRequest } from '../../interfaces/request/DownloadSpecificVocabularyRequest';
import { RequestResolver } from './RequestResolver';

export class DownloadSpecificVocabularyRequestResolver extends RequestResolver<
  DownloadSpecificVocabularyRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      vocabularyIds: Joi.array().items(Joi.string()),
    },
  };
}
