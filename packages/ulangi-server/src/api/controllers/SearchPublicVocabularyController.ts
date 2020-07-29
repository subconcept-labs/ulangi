/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  PublicVocabulary,
  SearchPublicVocabularyRequest,
  SearchPublicVocabularyResponse,
} from '@ulangi/ulangi-common/interfaces';
import { SearchPublicVocabularyRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { LibraryFacade } from '@ulangi/ulangi-library';

import { GoogleTranslateAdapter } from '../../adapters/GoogleTranslateAdapter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { isVocabularyHasDefinitions } from '../../utils/isVocabularyHasDefinitions';
import { removeDuplicateMeanings } from '../../utils/removeDuplicateMeanings';
import { removePointlessMeanings } from '../../utils/removePointlessMeanings';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SearchPublicVocabularyController extends ApiController<
  SearchPublicVocabularyRequest,
  SearchPublicVocabularyResponse
> {
  private library: LibraryFacade;
  private googleTranslate: GoogleTranslateAdapter;
  private config: Config;

  public constructor(
    library: LibraryFacade,
    googleTranslate: GoogleTranslateAdapter,
    config: Config
  ) {
    super();
    this.library = library;
    this.googleTranslate = googleTranslate;
    this.config = config;
  }

  public options(): ControllerOptions<SearchPublicVocabularyRequest> {
    return {
      paths: ['/search-public-vocabulary'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new SearchPublicVocabularyRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SearchPublicVocabularyRequest>,
    res: ApiResponse<SearchPublicVocabularyResponse>
  ): Promise<void> {
    const { languageCodePair, searchTerm, limit, offset } = req.query;

    const [sourceLanguageCode, targetLanguageCode] = languageCodePair.split(
      '-'
    );

    let vocabularyList: readonly PublicVocabulary[] = [];

    if (offset >= this.config.library.fetchPublicVocabularyMaxOffset) {
      vocabularyList = [];
    } else {
      const detectedLanguageCodes = await this.googleTranslate.detectLanguages(
        searchTerm
      );

      if (detectedLanguageCodes.includes(sourceLanguageCode)) {
        vocabularyList = await this.library.searchPublicVocabulary(
          languageCodePair,
          searchTerm,
          limit,
          offset
        );
      } else if (detectedLanguageCodes.includes(targetLanguageCode)) {
        const meaning = searchTerm;

        const translations = await this.googleTranslate.translate(
          meaning,
          targetLanguageCode,
          sourceLanguageCode
        );

        vocabularyList =
          translations.length > 0
            ? await this.library.searchPublicVocabularyWithTermAndMeaning(
                languageCodePair,
                translations[0].translatedText,
                meaning,
                limit,
                offset
              )
            : await this.library.searchPublicVocabulary(
                languageCodePair,
                searchTerm,
                limit,
                offset
              );
      } else {
        vocabularyList = await this.library.searchPublicVocabulary(
          languageCodePair,
          searchTerm,
          limit,
          offset
        );
      }
    }

    const nextOffset =
      vocabularyList.length === 0 ? null : offset + vocabularyList.length;

    vocabularyList = vocabularyList
      .map(removePointlessMeanings)
      .map(removeDuplicateMeanings)
      .filter(isVocabularyHasDefinitions);

    res.json({ vocabularyList, nextOffset });
  }
}
