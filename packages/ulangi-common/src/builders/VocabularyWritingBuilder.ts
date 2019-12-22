/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import * as _ from 'lodash';
import * as moment from 'moment';

import { VocabularyWriting } from '../interfaces/general/VocabularyWriting';

export class VocabularyWritingBuilder {
  public build(
    vocabularyWriting: DeepPartial<VocabularyWriting>
  ): VocabularyWriting {
    return _.merge(
      {
        lastWrittenAt: null,
        disabled: false,
        level: 0,
        updatedAt: moment.utc().toDate(),
        createdAt: moment.utc().toDate(),
        firstSyncedAt: null,
        lastSyncedAt: null,
      },
      vocabularyWriting
    );
  }
}
