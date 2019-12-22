/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { SynthesizeSpeechRequest } from '@ulangi/ulangi-common/interfaces';
import { SynthesizeSpeechRequestResolver } from '@ulangi/ulangi-common/resolvers';
import * as _ from 'lodash';

import { GoogleTextToSpeechAdapter } from '../../adapters/GoogleTextToSpeechAdapter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SynthesizeSpeechController extends ApiController<
  SynthesizeSpeechRequest,
  {}
> {
  private googleTextToSpeech: GoogleTextToSpeechAdapter;
  private config: Config;

  public constructor(
    googleTextToSpeech: GoogleTextToSpeechAdapter,
    config: Config
  ) {
    super();
    this.googleTextToSpeech = googleTextToSpeech;
    this.config = config;
  }

  public options(): ControllerOptions<SynthesizeSpeechRequest> {
    return {
      paths: ['/synthesize-speech'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new SynthesizeSpeechRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<SynthesizeSpeechRequest>,
    res: ApiResponse<{}>
  ): Promise<void> {
    const { text, languageCode } = req.query;

    if (_.has(this.config.googleTextToSpeech.defaultVoices, languageCode)) {
      const data = await this.googleTextToSpeech.synthesizeSpeechByLanguageCodeAndVoiceName(
        text,
        this.config.googleTextToSpeech.defaultVoices[languageCode].languageCode,
        this.config.googleTextToSpeech.defaultVoices[languageCode].voiceName
      );

      if (data.length > 0) {
        res.binary(data[0].audioContent);
      } else {
        res.error(400, {
          errorCode: ErrorCode.VOCABULARY__CANNOT_SYNTHESIZE_SPEECH,
        });
      }
    } else {
      res.error(400, {
        errorCode:
          ErrorCode.VOCABULARY__LANGUAGE_NOT_SUPPORTED_FOR_SYNTHESIZE_SPEECH,
      });
    }
  }
}
