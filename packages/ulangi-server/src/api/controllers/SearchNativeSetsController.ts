/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  NativeSet,
  PublicSet,
  SearchNativeSetsRequest,
  SearchNativeSetsResponse,
} from '@ulangi/ulangi-common/interfaces';
import { SearchNativeSetsRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { LibraryFacade } from '@ulangi/ulangi-library';

import { PublicSetConverter } from '../../converters/PublicSetConverter';
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

export class SearchNativeSetsController extends ApiController<
  SearchNativeSetsRequest,
  SearchNativeSetsResponse
> {
  private publicSetConverter = new PublicSetConverter();

  private library: LibraryFacade;
  private config: Config;

  public constructor(library: LibraryFacade, config: Config) {
    super();
    this.library = library;
    this.config = config;
  }

  public options(): ControllerOptions<SearchNativeSetsRequest> {
    return {
      paths: ['/search-native-sets'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new SearchNativeSetsRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SearchNativeSetsRequest>,
    res: ApiResponse<SearchNativeSetsResponse>
  ): Promise<void> {
    const { languageCodePair, searchTerm, limit, offset } = req.query;

    let publicSets: readonly PublicSet[];
    if (offset >= this.config.library.fetchPublicSetMaxOffset) {
      publicSets = [];
    } else if (searchTerm === '') {
      publicSets =
        offset < this.config.library.fetchPublicSetMaxOffset
          ? await this.library.fetchPublicSets(
              languageCodePair,
              limit,
              offset,
              true
            )
          : [];
    } else {
      publicSets = await this.library.searchPublicSets(
        languageCodePair,
        searchTerm,
        limit,
        offset,
        false
      );
    }

    let setList = this.publicSetConverter.convertToNativeSets(
      publicSets.slice(),
      languageCodePair
    );

    setList = setList
      .map(
        (set): NativeSet => {
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

    res.json({ setList });
  }
}
