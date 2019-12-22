/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { DownloadVocabularyResponse } from '../../interfaces/response/DownloadVocabularyResponse';
import { VocabularyResolver } from '../general/VocabularyResolver';

export class DownloadVocabularyResponseResolver extends AbstractResolver<
  DownloadVocabularyResponse
> {
  private vocabularyResolver = new VocabularyResolver();

  protected rules = {
    vocabularyList: Joi.array().items(this.vocabularyResolver.getRules()),
    vocabularySetIdPairs: Joi.array().items(
      Joi.array().ordered(Joi.string(), Joi.string())
    ),
    noMore: Joi.boolean(),
  };
}
