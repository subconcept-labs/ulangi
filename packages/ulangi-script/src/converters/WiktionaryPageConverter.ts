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
  WiktionaryPage,
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

  public convertToDictionaryEntry(page: WiktionaryPage): DictionaryEntry {
    return {
      vocabularyText: page.title,
      definitions: this.extractDefinitions(page),
      categories: this.extractCategories(page),
      tags: [],
    };
  }

  public extractDefinitions(
    pageOrSections: WiktionaryPage | WiktionarySection[]
  ): PublicDefinition[] {
    const sections: WiktionarySection[] = [];

    if (_.isArray(pageOrSections)) {
      sections.push(...pageOrSections);
    } else {
      sections.push(
        ..._.flatMap(
          pageOrSections.languages,
          (language): WiktionarySection[] => {
            return language.children.slice();
          }
        )
      );
    }

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

  public extractCategories(page: WiktionaryPage): string[] {
    const categories = _.flatMap(
      page.languages,
      (language): string[] => {
        return language.categories;
      }
    );

    const nodes: WiktionarySection[] = _.flatMap(
      page.languages,
      (language): WiktionarySection[] => {
        return language.children.slice();
      }
    );

    while (nodes.length > 0) {
      const node = assertExists(nodes.pop());

      if (node.kind === 'wordClass') {
        categories.push(...node.categories);
      }

      if (node.kind !== 'example' && node.kind !== 'quotation') {
        nodes.push(...node.children);
      }
    }

    return _.uniq(categories);
  }

  public extractSources(pages: WiktionaryPage[]): string[] {
    const sources = [];

    const nodes: WiktionarySection[] = _.flatMap(
      pages,
      (page): WiktionarySection[] => {
        return _.flatMap(
          page.languages,
          (language): WiktionarySection[] => {
            return language.children.slice();
          }
        );
      }
    );

    while (nodes.length > 0) {
      const node = assertExists(nodes.pop());

      if (
        node.kind === 'definition' ||
        node.kind === 'example' ||
        node.kind === 'quotation'
      ) {
        sources.push(node.source);
      }

      if (node.kind !== 'example' && node.kind !== 'quotation') {
        nodes.push(...node.children);
      }
    }

    return _.uniq(sources);
  }
}
