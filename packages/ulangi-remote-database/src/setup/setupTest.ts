/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import 'jest-extended';

import * as dotenv from 'dotenv';
import * as path from 'path';

import { DatabaseManagerFacade } from '../facades/DatabaseManagerFacade';
import { resolveEnv } from '../setup/resolveEnv';

dotenv.config({ path: path.resolve(process.cwd(), 'config', '.env.test') });

const env = resolveEnv();

beforeAll(
  async (): Promise<void> => {
    await new DatabaseManagerFacade().createAllDatabasesIfNotExists(
      env.AUTH_DATABASE_CONFIG,
      env.ALL_SHARD_DATABASE_CONFIG,
      env.SHARD_DATABASE_NAME_PREFIX
    );
  }
);
