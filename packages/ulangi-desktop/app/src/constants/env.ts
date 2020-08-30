/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Env } from '../interfaces/Env';
import { EnvResolver } from '../resolvers/EnvResolver';

// TODO: Refactor env
// We should pass env to function instead of using it globally

export const env: Env = new EnvResolver().resolve(process.env, true);
