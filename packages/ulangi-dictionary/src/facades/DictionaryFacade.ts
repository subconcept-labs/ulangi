/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as elasticsearch from '@elastic/elasticsearch';
import { DictionaryEntry } from '@ulangi/ulangi-common/interfaces';
import { DictionaryEntryResolver } from '@ulangi/ulangi-common/resolvers';
import { createConnectionClass } from 'aws-es-connection';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

export class DictionaryFacade {
  private dictionaryEntryResolver = new DictionaryEntryResolver();
  private client: elasticsearch.Client;

  private indexPrefix = 'dictionary-';
  private existingIndices: string[] = [];

  public constructor(serverUrl: string, awsConfig?: AWS.Config) {
    if (typeof awsConfig !== 'undefined') {
      this.client = new elasticsearch.Client({
        node: serverUrl,
        Connection: createConnectionClass(awsConfig),
      });
    } else {
      this.client = new elasticsearch.Client({
        node: serverUrl,
      });
    }
  }

  public prefetchAllIndices(): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const response = await this.client.cat.indices({
            format: 'JSON',
          });

          this.existingIndices.push(
            ...response.body
              .filter(
                (indexInfo: { index: string }): boolean => {
                  return indexInfo.index.startsWith(this.indexPrefix);
                }
              )
              .map(
                (indexInfo: { index: string }): string => {
                  return indexInfo.index;
                }
              )
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public createDictionaryIndexByLanguagePair(
    languageCodePair: string
  ): Promise<any> {
    return this.client.indices.create({
      index: this.getIndexNameByLanguageCodePair(languageCodePair),
      body: {
        settings: {
          analysis: {
            normalizer: {
              keyword_lowercase: {
                type: 'custom',
                filter: ['lowercase'],
              },
            },
          },
        },
        mappings: {
          properties: {
            vocabularyTerm: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                },
                keyword_lowercase: {
                  type: 'keyword',
                  normalizer: 'keyword_lowercase',
                },
              },
            },
            definitions: {
              type: 'object',
              properties: {
                meaning: {
                  type: 'text',
                },
                wordClasses: {
                  type: 'keyword',
                  index: false,
                },
                source: {
                  type: 'keyword',
                  index: false,
                },
              },
            },
            tags: {
              type: 'text',
            },
            categories: {
              type: 'keyword',
              index: false,
            },
          },
        },
      },
    });
  }

  public deleteDictionaryIndexByLanguagePair(
    languageCodePair: string
  ): Promise<any> {
    return this.client.indices.delete({
      index: this.getIndexNameByLanguageCodePair(languageCodePair),
    });
  }

  public getDictionaryEntry(
    languageCodePair: string,
    vocabularyTerm: string
  ): Promise<null | DictionaryEntry> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const response = await this.client.search({
            index: this.getIndexNameByLanguageCodePair(languageCodePair),
            body: {
              size: 1,
              query: {
                bool: {
                  must: [
                    { term: { 'vocabularyTerm.keyword': vocabularyTerm } },
                  ],
                },
              },
            },
          });
          const hit: any = _.first(response.body.hits.hits);
          if (typeof hit === 'undefined') {
            resolve(null);
          } else {
            const dictionaryEntry = this.dictionaryEntryResolver.resolve(
              hit._source,
              true
            );
            resolve({
              ...dictionaryEntry,
              // vocabularyText is used only on v3.10.0 and below
              vocabularyText: dictionaryEntry.vocabularyTerm,
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public searchDictionaryEntries(
    languageCodePair: string,
    searchTerm: string,
    limit: number,
    offset: number
  ): Promise<DictionaryEntry[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const response = await this.client.search({
            index: this.getIndexNameByLanguageCodePair(languageCodePair),
            body: {
              from: offset,
              size: limit,
              query: {
                multi_match: {
                  query: searchTerm,
                  fields: ['vocabularyTerm^3', 'definitions.meaning'],
                },
              },
            },
          });
          const sources = response.body.hits.hits.map(
            (hit: any): unknown => hit._source
          );
          const dictionaryEntries = this.dictionaryEntryResolver.resolveArray(
            sources,
            true
          );
          resolve(dictionaryEntries.slice());
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async indexForLanguagePairExists(
    languageCodePair: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const response = await this.client.indices.exists({
            index: this.getIndexNameByLanguageCodePair(languageCodePair),
          });
          if (response.statusCode === 200) {
            resolve(true);
          } else if (response.statusCode === 404) {
            resolve(false);
          } else {
            reject(response);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getIndexNameByLanguageCodePair(languageCodePair: string): string {
    return this.indexPrefix + languageCodePair;
  }
}
