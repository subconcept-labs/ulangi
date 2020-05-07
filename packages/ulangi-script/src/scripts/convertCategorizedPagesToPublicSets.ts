#!/usr/bin/env node

/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DictionaryEntryConverter } from '@ulangi/ulangi-common/converters';
import { PublicSet, PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  WiktionaryPage,
  WiktionaryPageConverter,
} from '@ulangi/wiktionary-core';
import * as _ from 'lodash';
import * as readline from 'readline';
import * as uuid from 'uuid';

import { loadConfig } from '../setup/loadConfig';

export interface Author {
  name: string;
  link?: string;
}

run();

function run(): void {
  const config = loadConfig();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const wiktionaryPageConverter = new WiktionaryPageConverter();
  const dictionaryEntryConverter = new DictionaryEntryConverter();

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
            vocabularyList: _.flatMap(
              chunk,
              (page): PublicVocabulary[] => {
                return page.languages.map(
                  (language): PublicVocabulary => {
                    const dictionaryEntry = wiktionaryPageConverter.convertToDictionaryEntry(
                      page.title,
                      language
                    );

                    return dictionaryEntryConverter.convertDictionaryEntryToPublicVocabulary(
                      dictionaryEntry
                    );
                  }
                );
              }
            ),
            authors: _.uniqBy(
              _.flatMap(
                chunk,
                (page): Author[] => {
                  return _.flatMap(
                    page.languages,
                    (language): Author[] => {
                      return wiktionaryPageConverter
                        .extractSources(language)
                        .map(
                          (source): Author => {
                            return { name: source, link: '' };
                          }
                        );
                    }
                  );
                }
              ),
              ['name', 'link']
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
