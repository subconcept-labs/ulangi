/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

#!/usr/bin/env node

import { WiktionaryPage } from '@ulangi/wiktionary-core';
import * as _ from 'lodash';
import * as readline from 'readline';

import { WiktionaryPageConverter } from '../converters/WiktionaryPageConverter';

run();

function run(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const wiktionaryPageConverter = new WiktionaryPageConverter();

  rl.on('line', function(line): void {
    if (!_.isEmpty(line)) {
      const page: WiktionaryPage = JSON.parse(line);

      const dictionaryEntry = wiktionaryPageConverter.convertToDictionaryEntry(
        page
      );

      console.log(JSON.stringify(dictionaryEntry));
    }
  });
}
