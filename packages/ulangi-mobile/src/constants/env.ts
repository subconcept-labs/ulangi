/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import ENV from 'react-native-config';

import { Env } from '../interfaces/Env';
import { EnvResolver } from '../resolvers/EnvResolver';

// TODO: Refactor env
// We should pass env to function instead of using it globally

// convert "null" to null
export const rawEnv = _.mapValues(
  ENV,
  (value): string | null => {
    return value === 'null' ? null : value;
  },
);

export const env: Env = new EnvResolver().resolve(rawEnv, true);
