/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { WordClassConverter } from '@ulangi/ulangi-common/converters';
import {
  DictionaryEntry,
  PublicDefinition,
} from '@ulangi/ulangi-common/interfaces';
import {
  WiktionaryDefinition,
  WiktionaryEtymology,
  WiktionaryExample,
  WiktionaryLanguage,
  WiktionaryPronunciation,
  WiktionaryQuotation,
  WiktionaryWordClass,
} from '@ulangi/wiktionary-core';
import * as _ from 'lodash';

type WiktionarySection =
  | WiktionaryWordClass
  | WiktionaryEtymology
  | WiktionaryPronunciation
  | WiktionaryDefinition
  | WiktionaryExample
  | WiktionaryQuotation;

export class WiktionaryPageConverter {
  private wordClassConverter = new WordClassConverter();

  private excludeIPA = ['Vietnamese'];
  public convertToDictionaryEntry(
    pageTitle: string,
    language: WiktionaryLanguage
  ): DictionaryEntry {
    return {
      vocabularyTerm: pageTitle,
      definitions: this.extractDefinitions(language.children),
      categories: this.extractCategories(language),
      tags: [],
      ipa: !_.includes(this.excludeIPA, language.languageName)
        ? this.extractIPA(language.children)
        : undefined,
      pinyin: this.extractPinyin(language.children),
      romaji: this.extractRomaji(language.children),
      romanization: this.extractRomanization(language.children),
    };
  }

  public extractIPA(
    _sections: readonly WiktionarySection[]
  ): undefined | string[] {
    const ipa: string[] = [];

    const sections = _sections.slice();

    while (sections.length > 0) {
      const section = assertExists(sections.shift());

      if (section.kind === 'pronunciation') {
        const reg = /((?:\([^\)]*\))?\s?IPA\(key\): .*)/;

        const pronunciations = _.flatMap(
          section.pronunciations,
          (pronunication): string[] => {
            return pronunication.split('\n');
          }
        );

        pronunciations
          .filter(
            (pronunication): boolean => {
              return reg.test(pronunication);
            }
          )
          .forEach(
            (pronunication): void => {
              const matches = reg.exec(pronunication);
              if (matches !== null) {
                matches.shift();
                ipa.push(
                  matches
                    .filter((match): boolean => !_.isEmpty(match))
                    .map((match): string => match.replace(/IPA\(key\):\s/g, ''))
                    .map(_.trim)
                    .join(' ')
                );
              }
            }
          );

        sections.push(...section.children);
      } else if (section.kind !== 'example' && section.kind !== 'quotation') {
        sections.push(...section.children);
      }
    }

    return ipa.length > 0 ? ipa : undefined;
  }

  public extractPinyin(
    _sections: readonly WiktionarySection[]
  ): undefined | string[] {
    const pinyin: string[] = [];

    const sections = _sections.slice();

    while (sections.length > 0) {
      const section = assertExists(sections.shift());

      if (section.kind === 'pronunciation') {
        const reg = /\(Pinyin\): ([^\r\n]*)/;

        section.pronunciations
          .filter(
            (pronunication): boolean => {
              return reg.test(pronunication);
            }
          )
          .forEach(
            (pronunication): void => {
              const matches = reg.exec(pronunication);
              if (matches !== null && typeof matches[1] !== 'undefined') {
                pinyin.push(
                  ...matches[1]
                    .replace(/\s*\([^)]*\)*/, '')
                    .split(',')
                    .map(_.trim)
                    .filter((pinyin): boolean => !_.isEmpty(pinyin))
                );
              }
            }
          );

        sections.push(...section.children);
      } else if (section.kind !== 'example' && section.kind !== 'quotation') {
        sections.push(...section.children);
      }
    }

    return pinyin.length > 0 ? pinyin : undefined;
  }

  public extractRomaji(
    _sections: readonly WiktionarySection[]
  ): undefined | string[] {
    const romaji: string[] = [];

    const sections = _sections.slice();

    while (sections.length > 0) {
      const section = assertExists(sections.shift());

      if (section.kind === 'wordClass') {
        const reg = /rōmaji ([^\},]*)[\)|,]/;

        if (typeof section.headword !== 'undefined') {
          const matches = reg.exec(section.headword);

          if (matches !== null && typeof matches[1] !== 'undefined') {
            romaji.push(matches[1].trim());
          }
        }

        sections.push(...section.children);
      } else if (section.kind !== 'example' && section.kind !== 'quotation') {
        sections.push(...section.children);
      }
    }

    return romaji.length > 0 ? romaji : undefined;
  }

  public extractRomanization(
    _sections: readonly WiktionarySection[]
  ): undefined | string[] {
    const romanization: string[] = [];

    const sections = _sections.slice();

    while (sections.length > 0) {
      const section = assertExists(sections.shift());

      if (section.kind === 'pronunciation') {
        const reg = /Revised\sRomanization\?\n(.*)\n/;

        if (typeof section.pronunciations !== 'undefined') {
          section.pronunciations
            .filter(
              (pronunication): boolean => {
                return reg.test(pronunication);
              }
            )
            .forEach(
              (pronunication): void => {
                const matches = reg.exec(pronunication);
                if (matches !== null && typeof matches[1] !== 'undefined') {
                  romanization.push(matches[1].trim());
                }
              }
            );
        }

        sections.push(...section.children);
      } else if (section.kind !== 'example' && section.kind !== 'quotation') {
        sections.push(...section.children);
      }
    }

    return romanization.length > 0 ? romanization : undefined;
  }

  public extractDefinitions(
    sections: readonly WiktionarySection[]
  ): PublicDefinition[] {
    return _.flatMap(
      sections,
      (section): PublicDefinition[] => {
        if (section.kind === 'wordClass') {
          if (this.wordClassConverter.canConvert(section.wordClass)) {
            return this.extractDefinitions(section.children.slice()).map(
              (definition): PublicDefinition => {
                return {
                  ...definition,
                  wordClasses: [
                    this.wordClassConverter.convert(section.wordClass),
                  ],
                };
              }
            );
          } else {
            return this.extractDefinitions(section.children.slice());
          }
        } else if (section.kind === 'definition') {
          const subDefinitions = this.extractDefinitions(
            section.children.slice()
          );
          if (subDefinitions.length > 0) {
            return subDefinitions.map(
              (subDefinition): PublicDefinition => {
                return {
                  meaning: [section.meaning, subDefinition.meaning].join(': '),
                  source: section.source,
                  wordClasses: [],
                };
              }
            );
          } else {
            return [
              {
                meaning: section.meaning,
                wordClasses: [],
                source: section.source,
              },
            ];
          }
        } else if (section.kind !== 'example' && section.kind !== 'quotation') {
          return this.extractDefinitions(section.children.slice());
        } else {
          return [];
        }
      }
    );
  }

  public extractSources(_sections: readonly WiktionarySection[]): string[] {
    const sources = [];

    const sections = _sections.slice();

    while (sections.length > 0) {
      const section = assertExists(sections.shift());

      if (
        section.kind === 'definition' ||
        section.kind === 'example' ||
        section.kind === 'quotation'
      ) {
        sources.push(section.source);
      }

      if (section.kind !== 'example' && section.kind !== 'quotation') {
        sections.push(...section.children);
      }
    }

    return _.uniq(sources);
  }

  public extractCategories(language: WiktionaryLanguage): string[] {
    const categories = language.categories;

    const sections: WiktionarySection[] = language.children.slice();

    while (sections.length > 0) {
      const section = assertExists(sections.pop());

      if (section.kind === 'wordClass') {
        categories.push(...section.categories);
      } else if (section.kind !== 'example' && section.kind !== 'quotation') {
        sections.push(...section.children);
      }
    }

    return _.uniq(categories);
  }
}
