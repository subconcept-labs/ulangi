/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  PublicSet,
  SearchPublicSetsRequest,
  SearchPublicSetsResponse,
} from '@ulangi/ulangi-common/interfaces';
import { SearchPublicSetsRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { LibraryFacade } from '@ulangi/ulangi-library';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { isUsefulSet } from '../../utils/isUsefulSet';
import { isVocabularyHasDefinitions } from '../../utils/isVocabularyHasDefinitions';
import { removeDuplicateMeanings } from '../../utils/removeDuplicateMeanings';
import { removePointlessMeanings } from '../../utils/removePointlessMeanings';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SearchPublicSetsController extends ApiController<
  SearchPublicSetsRequest,
  SearchPublicSetsResponse
> {
  private library: LibraryFacade;
  private config: Config;

  public constructor(library: LibraryFacade, config: Config) {
    super();
    this.library = library;
    this.config = config;
  }

  public options(): ControllerOptions<SearchPublicSetsRequest> {
    return {
      paths: ['/search-public-sets'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new SearchPublicSetsRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SearchPublicSetsRequest>,
    res: ApiResponse<SearchPublicSetsResponse>
  ): Promise<void> {
    const {
      languageCodePair,
      searchTerm,
      limit,
      offset,
      curatedOnly,
    } = req.query;

    let setList: readonly PublicSet[];
    if (offset >= this.config.library.fetchPublicSetMaxOffset) {
      setList = [];
    } else if (searchTerm === '') {
      setList = await this.library.fetchPublicSets(
        languageCodePair,
        limit,
        offset,
        curatedOnly
      );
    } else {
      setList = await this.library.searchPublicSets(
        languageCodePair,
        searchTerm,
        limit,
        offset,
        curatedOnly
      );
    }

    const nextOffset = setList.length === 0 ? null : offset + setList.length;

    setList = setList
      .map(
        (set): PublicSet => {
          return {
            ...set,
            vocabularyList: set.vocabularyList
              .map(removePointlessMeanings)
              .map(removeDuplicateMeanings)
              .filter(isVocabularyHasDefinitions),
          };
        }
      )
      .filter(isUsefulSet);

    res.json({ setList, nextOffset });
  }
}
