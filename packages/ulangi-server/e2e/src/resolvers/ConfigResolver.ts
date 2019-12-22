import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Config } from '../interfaces/Config';

export class ConfigResolver extends AbstractResolver<Config> {
  protected rules = {
    languageCodesForSpeechTesting: Joi.array().items(Joi.string())
  };
}
