/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';

import { DefinitionExtraFieldDetails } from '../../constants/DefinitionExtraFieldDetails';
import { DefinitionExtraFields } from '../../interfaces/general/DefinitionExtraFields';
import { ExtraFieldParser } from './ExtraFieldParser';

@boundClass
export class DefinitionExtraFieldParser extends ExtraFieldParser<
  { [P in keyof DefinitionExtraFields]: DefinitionExtraFields[P] }
> {
  public readonly extraFieldDetails = DefinitionExtraFieldDetails;

  public parse(
    meaning: string
  ): {
    plainMeaning: string;
    extraFields: DefinitionExtraFields;
  } {
    const parseResultFromRight = this.parseFromRight(meaning, true);
    const parseResultFromLeft = this.parseFromLeft(meaning, true);

    const plainMeaning = this.trimWhiteSpacesAndPipes(
      parseResultFromLeft.stoppedAt <= parseResultFromRight.stoppedAt
        ? meaning.substring(
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
            name as keyof DefinitionExtraFields
          ] || []),
          ...(parseResultFromLeft.capturedValues[
            name as keyof DefinitionExtraFields
          ] || []),
        ]);
      }
    );

    return { plainMeaning, extraFields };
  }
}
