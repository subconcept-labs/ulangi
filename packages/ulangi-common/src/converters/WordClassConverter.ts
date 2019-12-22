/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import * as _ from 'lodash';

import { WordClass } from '../enums/WordClass';

export class WordClassConverter {
  protected mapping = {
    adjective: WordClass.ADJECTIVE,
    verb: WordClass.VERB,
    noun: WordClass.NOUN,
    pronoun: WordClass.PRONOUN,
    adverb: WordClass.ADVERB,
  };

  public canConvert(wordClass: string): boolean {
    const wordClassLowerCase = wordClass.toLowerCase();
    return _.has(this.mapping, wordClassLowerCase);
  }

  public convert(wordClass: string): WordClass {
    const wordClassLowerCase = wordClass.toLowerCase();
    return assertExists(_.get(this.mapping, wordClassLowerCase));
  }
}
