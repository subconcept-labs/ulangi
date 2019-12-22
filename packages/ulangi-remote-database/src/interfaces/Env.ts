/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AuthDbConfig } from '../interfaces/AuthDbConfig';
import { ShardDbConfig } from '../interfaces/ShardDbConfig';

export interface Env {
  readonly AUTH_DATABASE_CONFIG: AuthDbConfig;
  readonly ALL_SHARD_DATABASE_CONFIG: readonly ShardDbConfig[];
  readonly SHARD_DATABASE_NAME_PREFIX: string;
}
