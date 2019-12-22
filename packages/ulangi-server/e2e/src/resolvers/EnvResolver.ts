import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Env } from '../interfaces/Env';

export class EnvResolver extends AbstractResolver<Env> {

  protected rules = {
    SERVER_URL: Joi.string(),
    API_URL: Joi.string(),
  };
}
