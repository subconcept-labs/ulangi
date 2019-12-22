/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, ReadonlyTuple } from '@ulangi/extended-types';

import { Vocabulary } from '../general/Vocabulary';
import { Request } from './Request';

export interface UploadVocabularyRequest extends Request {
  readonly path: '/upload-vocabulary';
  readonly method: 'post';
  readonly authRequired: true;
  readonly query: null;
  readonly body: {
    readonly vocabularyList: readonly DeepPartial<Vocabulary>[];
    readonly vocabularySetIdPairs: readonly ReadonlyTuple<string, string>[];
  };
}
