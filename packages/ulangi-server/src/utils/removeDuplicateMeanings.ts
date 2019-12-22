/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

interface VocabularyWithDefinitions {
  readonly definitions: readonly { meaning: string }[];
}

export function removeDuplicateMeanings<T extends VocabularyWithDefinitions>(
  vocabulary: T
): T {
  return {
    ...vocabulary,
    definitions: _.uniqBy(vocabulary.definitions, 'meaning'),
  };
}
