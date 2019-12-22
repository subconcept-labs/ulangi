/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionExtraFieldParser } from '@ulangi/ulangi-common/core';
import { WordClass } from '@ulangi/ulangi-common/enums';

import { config } from '../../constants/config';

export class DefinitionDelegate {
  private definitionExtraFieldParser = new DefinitionExtraFieldParser();

  public hasCustomWordClasses(meaning: string): boolean {
    return (
      this.definitionExtraFieldParser.parse(meaning).extraFields.wordClass
        .length > 0
    );
  }

  public prependBuiltInWordClassesToMeaning(
    meaning: string,
    wordClasses: readonly WordClass[]
  ): string {
    // Only prepend if there are no custom word classes in meaning
    if (!this.hasCustomWordClasses(meaning) && wordClasses.length > 0) {
      const wordClassesInString = wordClasses
        .map(
          (wordClass): string => {
            return '[' + config.builtInWordClass.map[wordClass].abbr + ']';
          }
        )
        .join(' ');

      return wordClassesInString + ' ' + meaning;
    } else {
      return meaning;
    }
  }
}
