/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import * as _ from 'lodash';

import { Env } from '../interfaces/Env';
import { EnvResolver } from '../resolvers/EnvResolver';

export function resolveEnv(): Env {
  const AUTH_DATABASE_CONFIG = preprocessAuthDbConfig(
    assertExists(
      process.env.AUTH_DATABASE_CONFIG,
      'Missing AUTH_DATABASE_CONFIG env'
    )
  );
  const ALL_SHARD_DATABASE_CONFIG = preprocessAllShardDbConfig(
    assertExists(
      process.env.ALL_SHARD_DATABASE_CONFIG,
      'Missing ALL_SHARD_DATABASE_CONFIG env'
    )
  );
  const env = new EnvResolver().resolve(
    {
      ..._.mapValues(
        process.env,
        (value): string | undefined | null => {
          return value === 'null' ? null : value;
        }
      ),
      AUTH_DATABASE_CONFIG,
      ALL_SHARD_DATABASE_CONFIG,
    },
    true
  );

  return env;
}

function preprocessAuthDbConfig(authDatabaseConfig: string): object {
  const match = assertExists(
    authDatabaseConfig.match(/[^()]+/),
    'auth db config should not be null'
  );
  const [host, port, databaseName, user, password, connectionLimit] = _.map(
    match[0].split(';'),
    _.trim
  );
  return {
    host,
    port,
    databaseName,
    user,
    password,
    connectionLimit,
  };
}

function preprocessAllShardDbConfig(allShardDatabaseConfig: string): object {
  const matches = assertExists(
    allShardDatabaseConfig.match(/[^()]+/g),
    'shard config should not be null'
  );
  return matches.map(
    (match): object => {
      const [shardId, host, port, user, password, connectionLimit] = _.map(
        match.split(';'),
        _.trim
      );
      return {
        shardId,
        host,
        port,
        user,
        password,
        connectionLimit,
      };
    }
  );
}
