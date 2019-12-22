/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Env } from '../interfaces/Env';
import { AuthDbConfigResolver } from '../resolvers/AuthDbConfigResolver';
import { ShardDbConfigResolver } from '../resolvers/ShardDbConfigResolver';

export class EnvResolver extends AbstractResolver<Env> {
  protected authDbConfigResolver = new AuthDbConfigResolver();
  protected shardDbConfigResolver = new ShardDbConfigResolver();

  protected rules = {
    AUTH_DATABASE_CONFIG: Joi.object(this.authDbConfigResolver.getRules()),
    ALL_SHARD_DATABASE_CONFIG: Joi.array().items(
      this.shardDbConfigResolver.getRules()
    ),
    SHARD_DATABASE_NAME_PREFIX: Joi.string(),
  };
}
