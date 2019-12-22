/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  TranslateBidirectionRequest,
  TranslateBidirectionResponse,
  TranslationWithLanguages,
} from '@ulangi/ulangi-common/interfaces';
import { TranslateBidirectionRequestResolver } from '@ulangi/ulangi-common/resolvers';

import { GoogleTranslateAdapter } from '../../adapters/GoogleTranslateAdapter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class TranslateBidirectionController extends ApiController<
  TranslateBidirectionRequest,
  TranslateBidirectionResponse
> {
  private googleTranslate: GoogleTranslateAdapter;

  public constructor(googleTranslate: GoogleTranslateAdapter) {
    super();
    this.googleTranslate = googleTranslate;
  }

  public options(): ControllerOptions<TranslateBidirectionRequest> {
    return {
      paths: ['/translate-bidirection'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new TranslateBidirectionRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<TranslateBidirectionRequest>,
    res: ApiResponse<TranslateBidirectionResponse>
  ): Promise<void> {
    const { sourceText, languageCodePair } = req.query;

    const allTranslations: TranslationWithLanguages[] = [];
    const [firstLanguageCode, secondLanguageCode] = languageCodePair.split('-');

    const translations = await this.googleTranslate.translate(
      sourceText,
      firstLanguageCode,
      secondLanguageCode
    );
    allTranslations.push(
      ...translations.map(
        (translation): TranslationWithLanguages => {
          return {
            ...translation,
            sourceLanguageCode: firstLanguageCode,
            translatedLanguageCode: secondLanguageCode,
          };
        }
      )
    );

    const reversedTranslations = await this.googleTranslate.translate(
      sourceText,
      secondLanguageCode,
      firstLanguageCode
    );
    allTranslations.push(
      ...reversedTranslations.map(
        (translation): TranslationWithLanguages => {
          return {
            ...translation,
            sourceLanguageCode: secondLanguageCode,
            translatedLanguageCode: firstLanguageCode,
          };
        }
      )
    );

    res.json({ translations: allTranslations });
  }
}
