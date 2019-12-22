/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Config } from '../interfaces/Config';
import { ConfigResolver } from '../resolvers/ConfigResolver';

// TODO: Refactor config
// We should pass config to function instead of using it globally

// eslint-disable-next-line
export const rawConfig = require('../../config/config.json');

export const config: Config = new ConfigResolver().resolve(rawConfig, true);
