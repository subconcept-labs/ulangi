#!/usr/bin/env node

/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DictionaryEntryConverter } from '@ulangi/ulangi-common/converters';
import {
  WiktionaryPage,
  WiktionaryPageConverter,
} from '@ulangi/wiktionary-core';
import * as _ from 'lodash';
import * as readline from 'readline';

run();

function run(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const wiktionaryPageConverter = new WiktionaryPageConverter();
  const dictionaryEntryConverter = new DictionaryEntryConverter();

  rl.on('line', function(line): void {
    if (!_.isEmpty(line)) {
      const page: WiktionaryPage = JSON.parse(line);

      page.languages.forEach(
        (language): void => {
          const dictionaryEntry = wiktionaryPageConverter.convertToDictionaryEntry(
            page.title,
            language
          );

          // Do not write simplified Chinese entry from Wiktionary
          if (
            typeof dictionaryEntry.traditional !== 'undefined' &&
            dictionaryEntry.traditional.length > 0
          ) {
            return;
          } else {
            console.log(JSON.stringify(dictionaryEntry));

            // For chinese traditional entry only
            if (
              typeof dictionaryEntry.simplified !== 'undefined' &&
              dictionaryEntry.simplified.length > 0
            ) {
              const simplifiedFirstEntry = dictionaryEntryConverter.convertToSimplifiedFirst(
                dictionaryEntry
              );

              console.log(JSON.stringify(simplifiedFirstEntry));
            }
          }
        }
      );
    }
  });
}
