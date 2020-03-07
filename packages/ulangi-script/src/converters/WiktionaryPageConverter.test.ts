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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
              pronunciations: [''],
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
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

  it('convert page with multiple pronuncaitions', (): void => {
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
              pronunciations: [
                '(UK, US) IPA(key): /ɪnˌsaɪ.kləˈpi(ː).di.ə/',
                'IPA(key): /θɪˈsɔːɹəs/',
                '(Sweden) IPA(key): /dɔm/, (formal) IPA(key): /deː/, (dialectal) IPA(key): /diː/, IPA(key): /dɪ/',
              ],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[dog]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.ipa).toEqual([
      '(UK, US) /ɪnˌsaɪ.kləˈpi(ː).di.ə/',
      '/θɪˈsɔːɹəs/',
      '(Sweden) /dɔm/, (formal) /deː/, (dialectal) /diː/, /dɪ/',
    ]);
  });

  it('convert page with a single pronunciation in multiple lines', (): void => {
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
              pronunciations: [
                '(Hà Nội) IPA(key): [ŋu˧˧ muəj˧˨ʔ]\n(Huế) IPA(key): [ŋʊw˧˧ muj˨˩ʔ]\n(Hồ Chí Minh City) IPA(key): [ŋʊw˧˧ muj˨˩˨]',
              ],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[dog]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
      'dictionaryEntry should not be null'
    );
    expect(dictionaryEntry.ipa).toEqual([
      '(Hà Nội) [ŋu˧˧ muəj˧˨ʔ]',
      '(Huế) [ŋʊw˧˧ muj˨˩ʔ]',
      '(Hồ Chí Minh City) [ŋʊw˧˧ muj˨˩˨]',
    ]);
  });

  it('convert page with pinyin', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '愛',
      languages: [
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'pronunciation',
              pronunciations: [
                'Mandarin\n(Standard)\n(Pinyin): ài (ai4)\n(Zhuyin): ㄞˋ\nFile:zh-ài.ogg\n(Chengdu, SP): ngai4\n(Dungan, Cyrillic): нэ (ne, III)\nCantonese\n(Guangzhou, Jyutping): oi3\n(Taishan, Wiktionary): oi1\nGan (Wiktionary): ngai4\nHakka\n(Sixian, PFS): oi\n(Meixian, Guangdong): oi4\n',
              ],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[dog]]',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          languageName: 'Chinese',
          categories: [],
          children: [
            {
              kind: 'pronunciation',
              pronunciations: [
                'Mandarin\n(Pinyin): qīng, jīng (qing1, jing1)\n(Zhuyin): ㄑㄧㄥ, ㄐㄧㄥ\nCantonese (Jyutping): ceng1, cing1\nHakka\n(Sixian, PFS): chhiâng / chhîn / chhiang\n(Meixian, Guangdong): qiang1\nMin Bei (KCR): cháng\nMin Dong (BUC): chăng / chĭng\nMin Nan\n',
              ],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[dog]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page.title, page.languages[0])
    );

    expect(dictionaryEntry.pinyin).toEqual(['ài']);

    const dictionaryEntry2 = assertExists(
      converter.convertToDictionaryEntry(page.title, page.languages[1])
    );

    expect(dictionaryEntry2.pinyin).toEqual(['qīng', 'jīng']);
  });

  it('convert page with romaji in headword', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '易しい',
      languages: [
        {
          languageName: 'Japanese',
          children: [
            {
              kind: 'wordClass',
              wordClass: 'Adjective',
              headword:
                '易しい (-i inflection, hiragana やさしい, rōmaji yasashii)',
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: 'easy',
                  children: [],
                },
              ],
              categories: ['basic words'],
            },
            {
              kind: 'wordClass',
              wordClass: 'Adjective',
              headword: '(hiragana ゆう, rōmaji Yū, historical hiragana いう)',
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: 'easy',
                  children: [],
                },
              ],
              categories: ['basic words'],
            },
          ],
          categories: [],
        },
      ],
    };

    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
      'dictionaryEntry should not be null'
    );

    expect(dictionaryEntry.romaji).toEqual(['yasashii', 'Yū']);
  });

  it('convert page with romanization in pronunciations', (): void => {
    const converter = new WiktionaryPageConverter();
    const page: WiktionaryPage = {
      title: '글피',
      languages: [
        {
          languageName: 'Korean',
          categories: [],
          children: [
            {
              kind: 'pronunciation',
              pronunciations: [
                "IPA(key)[kɯɭpʰi]\nPhonetic Hangul[글피]\n\n\n\n\nRevised Romanization?\ngeulpi\nRevised Romanization (translit.)?\ngeulpi\nMcCune–Reischauer?\nkŭlp'i\nYale Romanization?\nkulphi",
              ],
              children: [
                {
                  kind: 'definition',
                  source: 'wiktionary',
                  meaning: '[[dog]]',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const dictionaryEntry = assertExists(
      converter.convertToDictionaryEntry(page.title, page.languages[0]),
      'dictionaryEntry should not be null'
    );

    expect(dictionaryEntry.romanization).toEqual(['geulpi']);
  });
});
