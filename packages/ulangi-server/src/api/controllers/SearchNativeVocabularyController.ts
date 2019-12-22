/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  SearchNativeVocabularyRequest,
  SearchNativeVocabularyResponse,
} from '@ulangi/ulangi-common/interfaces';
import { SearchNativeVocabularyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { LibraryFacade } from '@ulangi/ulangi-library';

import { PublicVocabularyConverter } from '../../converters/PublicVocabularyConverter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { isVocabularyHasDefinitions } from '../../utils/isVocabularyHasDefinitions';
import { removeDuplicateMeanings } from '../../utils/removeDuplicateMeanings';
import { removePointlessMeanings } from '../../utils/removePointlessMeanings';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SearchNativeVocabularyController extends ApiController<
  SearchNativeVocabularyRequest,
  SearchNativeVocabularyResponse
> {
  private publicVocabularyConverter = new PublicVocabularyConverter();

  private library: LibraryFacade;
  private config: Config;

  public constructor(library: LibraryFacade, config: Config) {
    super();
    this.library = library;
    this.config = config;
  }

  public options(): ControllerOptions<SearchNativeVocabularyRequest> {
    return {
      paths: ['/search-native-vocabulary'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new SearchNativeVocabularyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SearchNativeVocabularyRequest>,
    res: ApiResponse<SearchNativeVocabularyResponse>
  ): Promise<void> {
    const { languageCodePair, searchTerm, limit, offset } = req.query;

    const publicVocabularyList =
      offset >= this.config.library.fetchPublicVocabularyMaxOffset
        ? []
        : await this.library.searchPublicVocabulary(
            languageCodePair,
            searchTerm,
            limit,
            offset
          );

    let vocabularyList = this.publicVocabularyConverter.convertToNativeVocabularyList(
      publicVocabularyList.slice()
    );

    vocabularyList = vocabularyList
      .map(removePointlessMeanings)
      .map(removeDuplicateMeanings)
      .filter(isVocabularyHasDefinitions);

    res.json({ vocabularyList });
  }
}
