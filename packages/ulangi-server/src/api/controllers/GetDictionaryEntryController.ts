/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  GetDictionaryEntryRequest,
  GetDictionaryEntryResponse,
} from '@ulangi/ulangi-common/interfaces';
import { GetDictionaryEntryRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DictionaryFacade } from '@ulangi/ulangi-dictionary';
import * as _ from 'lodash';
import * as stopword from 'stopword';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { removePointlessMeanings } from '../../utils/removePointlessMeanings';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class GetDictionaryEntryController extends ApiController<
  GetDictionaryEntryRequest,
  GetDictionaryEntryResponse
> {
  private dictionary: DictionaryFacade;

  public constructor(dictionary: DictionaryFacade) {
    super();
    this.dictionary = dictionary;
  }

  public options(): ControllerOptions<GetDictionaryEntryRequest> {
    return {
      paths: ['/get-dictionary-entry'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new GetDictionaryEntryRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<GetDictionaryEntryRequest>,
    res: ApiResponse<GetDictionaryEntryResponse>
  ): Promise<void> {
    const {
      searchTerm,
      searchTermLanguageCode,
      translatedToLanguageCode,
    } = req.query;

    const languageCodePair =
      searchTermLanguageCode + '-' + translatedToLanguageCode;

    let dictionaryEntry = await this.dictionary.getDictionaryEntry(
      languageCodePair,
      searchTerm
    );

    // Try it again without stop words
    if (dictionaryEntry === null && _.has(stopword, searchTermLanguageCode)) {
      const delimiter = _.includes(['zh', 'ja', 'ko'], searchTermLanguageCode)
        ? ''
        : ' ';

      dictionaryEntry = await this.dictionary.getDictionaryEntry(
        languageCodePair,
        stopword
          .removeStopwords(
            searchTerm.split(delimiter),
            _.get(stopword, searchTermLanguageCode)
          )
          .join(delimiter)
          .trim()
      );
    }

    if (dictionaryEntry === null) {
      res.error(404, { errorCode: ErrorCode.DICTIONARY__NO_RESULTS });
    } else {
      dictionaryEntry = removePointlessMeanings(dictionaryEntry);

      res.json({ dictionaryEntry });
    }
  }
}
