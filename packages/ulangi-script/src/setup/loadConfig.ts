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

import { ConfigResolver } from '../resolvers/ConfigResolver';
import { Config } from '../types/Config';

export function loadConfig(): Config {
  const config = yaml.safeLoad(
    fs.readFileSync(
      path.join(appRoot.toString(), 'config', 'config.yml'),
      'utf8'
    )
  );

  return new ConfigResolver().resolve(config, true);
}
