/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';

import { VocabularyExtraFieldDetails } from '../../constants/VocabularyExtraFieldDetails';
import { VocabularyExtraFields } from '../../interfaces/general/VocabularyExtraFields';
import { ExtraFieldParser } from './ExtraFieldParser';

@boundClass
export class VocabularyExtraFieldParser extends ExtraFieldParser<
  { [P in keyof VocabularyExtraFields]: VocabularyExtraFields[P] }
> {
  public readonly extraFieldDetails = VocabularyExtraFieldDetails;

  public parse(
    vocabularyText: string
  ): {
    vocabularyTerm: string;
    extraFields: VocabularyExtraFields;
  } {
    const parseResultFromRight = this.parseFromRight(vocabularyText, true);
    const parseResultFromLeft = this.parseFromLeft(vocabularyText, true);

    // Stripped all parsed contents
    const vocabularyTerm = this.trimWhiteSpacesAndPipes(
      parseResultFromLeft.stoppedAt <= parseResultFromRight.stoppedAt
        ? vocabularyText.substring(
            parseResultFromLeft.stoppedAt,
            parseResultFromRight.stoppedAt + 1
          )
        : ''
    );

    const extraFields = _.mapValues(
      this.extraFieldDetails,
      (__, name): string[][] => {
        return _.uniq([
          ...(parseResultFromRight.capturedValues[
            name as keyof VocabularyExtraFields
          ] || []),
          ...(parseResultFromLeft.capturedValues[
            name as keyof VocabularyExtraFields
          ] || []),
        ]);
      }
    );

    return { vocabularyTerm, extraFields };
  }
}
