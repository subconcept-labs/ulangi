/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as appRoot from 'app-root-path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import { Config } from '../interfaces/Config';
import { ConfigResolver } from '../resolvers/ConfigResolver';

export function loadConfig(): Config {
  const file = path.join(appRoot.toString(), 'config', 'server-config.yml');
  const config = new ConfigResolver().resolve(
    yaml.safeLoad(fs.readFileSync(file, 'utf8')),
    true
  );

  return config;
}
