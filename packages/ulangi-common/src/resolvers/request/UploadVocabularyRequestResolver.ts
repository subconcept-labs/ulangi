/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { UploadVocabularyRequest } from '../../interfaces/request/UploadVocabularyRequest';
import { VocabularyResolver } from '../general/VocabularyResolver';
import { RequestResolver } from './RequestResolver';

export class UploadVocabularyRequestResolver extends RequestResolver<
  UploadVocabularyRequest
> {
  private vocabularyResolver = new VocabularyResolver();

  protected rules = {
    query: Joi.strip(),
    body: {
      vocabularyList: Joi.array().items(
        Joi.object(this.vocabularyResolver.getRules()).options({
          presence: 'optional',
        })
      ),
      vocabularySetIdPairs: Joi.array().items(
        Joi.array().ordered(Joi.string(), Joi.string().required())
      ),
    },
  };
}
