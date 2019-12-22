/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { WiktionaryExample, WiktionaryPage } from '@ulangi/wiktionary-core';

import { WiktionaryPageConverter } from './WiktionaryPageConverter';

describe('WiktionaryPageConverter', (): void => {
  it('convert page with one definition in etymology-wordclass section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'etymology',
              sectionName: 'etymology',
              children: [
                {
                  kind: 'wordClass',
                  wordClass: 'Noun',
                  children: [
                    {
                      kind: 'definition',
                      source: 'wiktionary',
                      meaning:
                        '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]',
                      children: [],
                    },
                  ],
                  categories: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.definitions[0].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]'
    );
  });

  it('convert page with one definition in word class section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'wordClass',
              wordClass: 'Noun',
              categories: [],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.definitions[0].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]'
    );
  });

  it('convert page with one definition in pronunciation section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'pronunciation',
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.definitions[0].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]'
    );
  });

  it('convert page with one definition in language section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'definition',
              source: 'wiktionary',
              meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]',
              children: [
                // eslint-disable-next-line
                { source: 'wiktionary', kind: 'example' } as WiktionaryExample,
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.definitions[0].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]'
    );
  });

  it('convert page with categories in language section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: ['Category 1', 'Category 2'],
          children: [
            {
              kind: 'definition',
              source: 'wiktionary',
              meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]',
              children: [
                // eslint-disable-next-line
                { source: 'wiktionary', kind: 'example' } as WiktionaryExample,
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.categories).toEqual(['Category 1', 'Category 2']);
  });

  it('convert page with categories in word class section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'wordClass',
              wordClass: 'Noun',
              categories: ['Category 1', 'Category 2'],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]',
                  children: [],
                },
              ],
            },
            {
              kind: 'wordClass',
              wordClass: 'Noun',
              categories: [],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[cat]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.categories).toEqual(['Category 1', 'Category 2']);
  });

  it('convert page with multiple definitions in same word class section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'wordClass',
              wordClass: 'Noun',
              categories: [],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]',
                  children: [],
                },
              ],
            },
            {
              kind: 'wordClass',
              wordClass: 'Noun',
              categories: [],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[cat]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.definitions[0].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[dog]]'
    );
    expect(dictionaryEntry.definitions[1].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[cat]]'
    );
  });

  it('convert page with two-level definitions (definition contains sub-definitions) in language section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'definition',
              source: 'wiktionary',
              meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}}',
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[dog]]',
                  children: [],
                },
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[cat]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.definitions[0].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}}: [[dog]]'
    );
    expect(dictionaryEntry.definitions[1].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}}: [[cat]]'
    );
  });

  it('convert page with many different levels of definition in language section', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '犬',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'definition',
              source: 'wiktionary',
              meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}}',
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[dog]]',
                  children: [],
                },
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[cat]]',
                  children: [],
                },
              ],
            },
            {
              kind: 'definition',
              source: 'wiktionary',
              meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[cow]]',
              children: [],
            },
            {
              kind: 'definition',
              source: 'wiktionary',
              meaning: '{{lb|zh|archaic|Min Dong|dialectal Wu}}',
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[mouse]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.definitions[0].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}}: [[dog]]'
    );
    expect(dictionaryEntry.definitions[1].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}}: [[cat]]'
    );
    expect(dictionaryEntry.definitions[2].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}} [[cow]]'
    );
    expect(dictionaryEntry.definitions[3].meaning).toEqual(
      '{{lb|zh|archaic|Min Dong|dialectal Wu}}: [[mouse]]'
    );
  });
});
