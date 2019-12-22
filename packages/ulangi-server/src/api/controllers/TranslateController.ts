/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  TranslateRequest,
  TranslateResponse,
} from '@ulangi/ulangi-common/interfaces';
import { TranslateRequestResolver } from '@ulangi/ulangi-common/resolvers';

import { GoogleTranslateAdapter } from '../../adapters/GoogleTranslateAdapter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class TranslateController extends ApiController<
  TranslateRequest,
  TranslateResponse
> {
  private googleTranslate: GoogleTranslateAdapter;

  public constructor(googleTranslate: GoogleTranslateAdapter) {
    super();
    this.googleTranslate = googleTranslate;
  }

  public options(): ControllerOptions<TranslateRequest> {
    return {
      paths: ['/translate'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new TranslateRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<TranslateRequest>,
    res: ApiResponse<TranslateResponse>
  ): Promise<void> {
    const {
      sourceText,
      sourceLanguageCode,
      translatedToLanguageCode,
      translator,
    } = req.query;

    if (translator === 'google') {
      const translations = await this.googleTranslate.translate(
        sourceText,
        sourceLanguageCode,
        translatedToLanguageCode
      );

      res.json({ translations });
    } else {
      res.error(400, {
        errorCode: ErrorCode.TRANSLATION__UNSUPPORTED_TRANSLATOR,
      });
    }
  }
}
