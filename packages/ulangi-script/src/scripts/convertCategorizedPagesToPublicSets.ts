/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

#!/usr/bin/env node

import { PublicSet, PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import { WiktionaryPage } from '@ulangi/wiktionary-core';
import * as _ from 'lodash';
import * as readline from 'readline';
import * as uuid from 'uuid';

import { WiktionaryPageConverter } from '../converters/WiktionaryPageConverter';
import { loadConfig } from '../setup/loadConfig';

run();

function run(): void {
  const config = loadConfig();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const wiktionaryPageConverter = new WiktionaryPageConverter();

  rl.on('line', function(line): void {
    if (!_.isEmpty(line)) {
      const categorized: {
        category: string;
        pages: WiktionaryPage[];
      } = JSON.parse(line);

      const chunks = _.chunk(categorized.pages, config.library.maxPerSet);
      const publicSets = chunks.map(
        (chunk, index): PublicSet => {
          return {
            publicSetId: uuid.v4(),
            title:
              chunks.length > 1
                ? categorized.category +
                  ` (part ${_.padStart((index + 1).toString(), 2, '0')})`
                : categorized.category,
            difficulty: 'N/A',
            tags: [],
            vocabularyList: chunk.map(
              (page): PublicVocabulary => {
                return {
                  publicVocabularyId: uuid.v4(),
                  vocabularyText: page.title,
                  definitions: wiktionaryPageConverter.extractDefinitions(page),
                  categories: wiktionaryPageConverter.extractCategories(page),
                };
              }
            ),
            authors: wiktionaryPageConverter.extractSources(chunk).map(
              (source): { name: string; link?: string } => {
                return {
                  name: source,
                  link: '',
                };
              }
            ),
          };
        }
      );

      publicSets.forEach(
        (set): void => {
          console.log(JSON.stringify(set));
        }
      );
    }
  });
}
