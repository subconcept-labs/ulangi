/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as elasticsearch from '@elastic/elasticsearch';
import { DictionaryEntryConverter } from '@ulangi/ulangi-common/converters';
import { PublicSet, PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import { PublicSetResolver } from '@ulangi/ulangi-common/resolvers';
import { DictionaryFacade } from '@ulangi/ulangi-dictionary';
import { createConnectionClass } from 'aws-es-connection';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

export class LibraryFacade {
  private client: elasticsearch.Client;
  private publicSetResolver = new PublicSetResolver();
  private dictionaryEntryConverter = new DictionaryEntryConverter();

  private serverUrl: string;
  private dictionary: DictionaryFacade;
  private existingIndices: string[];
  private indexPrefix = 'library-';

  public constructor(
    serverUrl: string,
    dictionary: DictionaryFacade,
    awsConfig?: AWS.Config
  ) {
    this.serverUrl = serverUrl;
    this.dictionary = dictionary;
    this.existingIndices = [];

    if (typeof awsConfig !== 'undefined') {
      this.client = new elasticsearch.Client({
        node: this.serverUrl,
        Connection: createConnectionClass(awsConfig),
      } as any);
    } else {
      this.client = new elasticsearch.Client({
        node: this.serverUrl,
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

  public createSetIndexByLanguagePair(languageCodePair: string): Promise<any> {
    return this.client.indices.create({
      index: this.getIndexNameByLanguageCodePair(languageCodePair),
      body: {
        mappings: {
          properties: {
            publicSetId: {
              type: 'keyword',
              index: false,
            },
            title: {
              type: 'text',
              copy_to: 'tags',
              fields: {
                keyword: {
                  type: 'keyword', // Used for sorting
                },
              },
            },
            subtitle: {
              type: 'text',
              index: false,
              copy_to: 'tags',
            },
            difficulty: {
              type: 'keyword',
              index: false,
            },
            authors: {
              type: 'object',
              properties: {
                name: {
                  type: 'keyword',
                  index: false,
                },
                link: {
                  type: 'keyword',
                  index: false,
                },
              },
            },
            tags: {
              type: 'text',
            },
            isCurated: {
              type: 'boolean',
            },
            vocabularyList: {
              type: 'nested',
              properties: {
                publicVocabularyId: {
                  type: 'keyword',
                  index: false,
                },
                vocabularyText: {
                  type: 'text',
                  index: false,
                  copy_to: ['tags', 'vocabularyList.tags'],
                  fields: {
                    keyword: {
                      type: 'keyword', // Used for aggregation
                    },
                  },
                },
                tags: {
                  type: 'text',
                },
                definitions: {
                  type: 'nested',
                  properties: {
                    meaning: {
                      type: 'text',
                      index: false,
                      copy_to: ['tags', 'vocabularyList.tags'],
                    },
                    source: {
                      type: 'keyword',
                      index: false,
                    },
                    wordClasses: {
                      type: 'keyword',
                      index: false,
                    },
                  },
                },
                categories: {
                  type: 'keyword',
                  index: false,
                },
              },
            },
          },
        },
      },
    });
  }

  public deleteSetIndexByLanguagePair(languageCodePair: string): Promise<any> {
    return this.client.indices.delete({
      index: this.getIndexNameByLanguageCodePair(languageCodePair),
    });
  }

  public getPublicSetCount(languageCodePair: string): Promise<number> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        const index = this.getIndexNameByLanguageCodePair(languageCodePair);

        try {
          const response = await this.client.cat.count({
            index,
            format: 'JSON',
          });

          const count = _.parseInt(_.get(response.body[0], 'count'));
          if (_.isNumber(count)) {
            resolve(count);
          } else {
            throw new Error('Invalid response');
          }
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
    );
  }

  public fetchPublicSets(
    languageCodePair: string,
    limit: number,
    offset: number,
    curatedOnly?: boolean
  ): Promise<readonly PublicSet[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        const index = this.getIndexNameByLanguageCodePair(languageCodePair);

        try {
          let query = undefined;
          if (curatedOnly === true) {
            query = {
              match: {
                isCurated: true,
              },
            };
          }

          const response = await this.client.search({
            index,
            body: {
              from: offset,
              size: limit,
              query,
              sort: [{ 'title.keyword': { order: 'asc' } }],
            },
          });
          const sources = response.body.hits.hits.map(
            (hit: any): unknown => hit._source
          );
          const publicSets = this.publicSetResolver.resolveArray(sources, true);
          resolve(publicSets);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public searchPublicSets(
    languageCodePair: string,
    searchTerm: string,
    limit: number,
    offset: number,
    curatedOnly?: boolean
  ): Promise<readonly PublicSet[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        const index = this.getIndexNameByLanguageCodePair(languageCodePair);

        try {
          let query = undefined;
          if (curatedOnly === true) {
            query = {
              bool: [
                {
                  must: {
                    match: {
                      isCurated: true,
                    },
                  },
                },
                {
                  must: {
                    multi_match: {
                      query: searchTerm,
                      fields: ['title^3', 'tags'],
                    },
                  },
                },
              ],
            };
          } else {
            query = {
              multi_match: {
                query: searchTerm,
                fields: ['title^3', 'tags'],
              },
            };
          }

          const response = await this.client.search({
            index,
            // Make _score more consistent for sorting
            search_type: 'dfs_query_then_fetch',
            body: {
              from: offset,
              size: limit,
              query,
              sort: [
                { _score: { order: 'desc' } },
                { 'title.keyword': { order: 'asc' } },
              ],
            },
          });

          const sources = response.body.hits.hits.map(
            (hit: any): unknown => hit._source
          );

          const publicSets = this.publicSetResolver.resolveArray(sources, true);
          resolve(publicSets);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public searchPublicVocabulary(
    languageCodePair: string,
    searchTerm: string,
    limit: number,
    offset: number
  ): Promise<readonly PublicVocabulary[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const dictionaryEntries = await this.dictionary.searchDictionaryEntries(
            languageCodePair,
            searchTerm,
            limit,
            offset
          );
          const publicVocabularyList = this.dictionaryEntryConverter.convertDictionaryEntriesToPublicVocabulary(
            dictionaryEntries
          );

          resolve(publicVocabularyList);
        } catch (error) {
          console.log(require('util').inspect(error, false, null));
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
