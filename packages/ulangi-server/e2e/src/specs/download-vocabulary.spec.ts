import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import {
  DefinitionStatus,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Definition, Vocabulary, Set } from '@ulangi/ulangi-common/interfaces';
import { DownloadVocabularyResponseResolver } from '@ulangi/ulangi-common/resolvers';
import Axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as querystring from 'query-string';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /download-vocabulary', (): void => {
  const env = resolveEnv();

  describe('Tests start after signing up and access token is retrieved', (): void => {
    let email;
    let password;
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        const response = await signUp(email, password);
        accessToken = response.data.accessToken;
      }
    );

    describe('Tests start after new set is uploaded', (): void => {
      let setList;
      beforeEach(
        async (): Promise<void> => {
          setList = Array(2).fill(null).map((_, index): Set => {
            return new SetBuilder().build({
              setName: 'test' + index,
              learningLanguageCode: 'en',
              translatedToLanguageCode: 'vi',
            })
          });
          await Axios.post(
            env.API_URL + '/upload-sets',
            {
              setList,
            },
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );
        }
      );

      describe('Tests starts after uploading vocabulary list', (): void => {
        let vocabularySetIdPairs;
        beforeEach(
          async (): Promise<void> => {
            vocabularySetIdPairs = [
              [
                new VocabularyBuilder().build({
                  vocabularyText: 'vocabulary 1',
                  lastLearnedAt: null,
                  createdAt: moment('2018-01-01').toDate(),
                  updatedStatusAt: moment('2018-01-01').toDate(),
                  updatedAt: moment('2018-01-01').toDate(),
                  category: {
                    categoryName: 'categoryName 1',
                    createdAt: moment('2018-02-01').toDate(),
                    updatedAt: moment('2018-02-01').toDate(),
                  },
                  writing: {
                    level: 1,
                    disabled: true,
                    lastWrittenAt: moment('2018-03-01').toDate(),
                    createdAt: moment('2018-03-01').toDate(),
                    updatedAt: moment('2018-03-01').toDate(),
                  },
                  definitions: [
                    {
                      meaning: 'meaning 1',
                      source: 'source 1',
                      createdAt: moment('2018-01-01').toDate(),
                      updatedStatusAt: moment('2018-01-01').toDate(),
                      updatedAt: moment('2018-01-01').toDate(),
                    },
                  ],
                }),
                setList[0].setId
              ],
              [
                new VocabularyBuilder().build({
                  vocabularyText: 'vocabulary 2',
                  vocabularyStatus: VocabularyStatus.ARCHIVED,
                  level: 1,
                  lastLearnedAt: moment('2018-01-01T03:00:00').toDate(),
                  createdAt: moment('2018-01-01T04:00:00').toDate(),
                  updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
                  updatedAt: moment('2018-01-01T01:00:00').toDate(),
                  definitions: [
                    {
                      meaning: 'meaning 2',
                      source: 'source 2',
                      definitionStatus: DefinitionStatus.DELETED,
                      updatedAt: moment('2018-01-01T04:00:00').toDate(),
                      updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
                      createdAt: moment('2018-01-01T00:00:00').toDate(),
                    },
                  ],
                }),
                setList[1].setId
              ],
              [
                new VocabularyBuilder().build({
                  vocabularyText: 'vocabulary 3',
                  vocabularyStatus: VocabularyStatus.DELETED,
                  level: 2,
                  lastLearnedAt: moment('2018-01-01T03:00:00').toDate(),
                  createdAt: moment('2018-01-01T04:00:00').toDate(),
                  updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
                  updatedAt: moment('2018-01-01T01:00:00').toDate(),
                }),
                setList[0].setId
              ]
            ];
            await Axios.post(
              env.API_URL + '/upload-vocabulary',
              {
                vocabularyList: vocabularySetIdPairs.map(
                  ([vocabulary]): Vocabulary => vocabulary
                ),
                vocabularySetIdPairs:vocabularySetIdPairs.map(
                  ([vocabulary, setId]): [string, string] => [
                    vocabulary.vocabularyId,
                    setId,
                  ]
                ),
              },
              { headers: { Authorization: 'Bearer ' + accessToken } }
            );
          }
        );

        it('should download all uploaded vocabulary without setId successfully', async (): Promise<
          void
        > => {
          // Need 2 requests to download all uploaded vocabulary
          const firstDownloadResponse = await Axios.get(
            env.API_URL +
              '/download-vocabulary?' +
              querystring.stringify({
                softLimit: 3,
              }),
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );

          const {
            vocabularyList: firstDownloadedVocabularyList,
            vocabularySetIdPairs: firstDownloadedVocabularySetIdPairs,
          } = new DownloadVocabularyResponseResolver().resolve(
            firstDownloadResponse.data,
            true
          );

          const maxSyncTime = _.maxBy(
            firstDownloadedVocabularyList,
            'lastSyncedAt'
          ).lastSyncedAt;

          // If download again should return empty list and no more = true
          const secondDownloadResponse = await Axios.get(
            env.API_URL +
              '/download-vocabulary?' +
              querystring.stringify({
                startAt: maxSyncTime,
                softLimit: 3,
              }),
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );

          const {
            vocabularyList: secondDownloadedVocabularyList,
            vocabularySetIdPairs: secondDownloadedVocabularySetIdPairs,
          } = new DownloadVocabularyResponseResolver().resolve(
            secondDownloadResponse.data,
            true
          );

          const expectedVocabularyList = vocabularySetIdPairs.map(
            ([vocabulary]): Vocabulary => {
              return {
                ...vocabulary,
                firstSyncedAt: expect.toBeDate(),
                lastSyncedAt: expect.toBeDate(),
                definitions: vocabulary.definitions.map(
                  (definition): Definition => {
                    return {
                      ...definition,
                      firstSyncedAt: expect.toBeDate(),
                      lastSyncedAt: expect.toBeDate(),
                    };
                  }
                ),
                category:
                  typeof vocabulary.category !== 'undefined'
                    ? {
                        ...vocabulary.category,
                        firstSyncedAt: expect.toBeDate(),
                        lastSyncedAt: expect.toBeDate(),
                      }
                    : undefined,
                writing:
                  typeof vocabulary.writing !== 'undefined'
                    ? {
                        ...vocabulary.writing,
                        firstSyncedAt: expect.toBeDate(),
                        lastSyncedAt: expect.toBeDate(),
                      }
                    : undefined,
              };
            }
          );

          expect(firstDownloadedVocabularyList).toIncludeAnyMembers(
            expectedVocabularyList
          );
          expect(firstDownloadedVocabularySetIdPairs).toIncludeAnyMembers(
            vocabularySetIdPairs.map(([vocabulary,setId]): [ string, string ] => [
              vocabulary.vocabularyId,
              setId
            ])
          );

          expect(secondDownloadedVocabularyList).toIncludeSameMembers(
            expectedVocabularyList
          );
          expect(secondDownloadedVocabularySetIdPairs).toIncludeSameMembers(
            vocabularySetIdPairs.map(([vocabulary,setId]): [ string, string ] => [
              vocabulary.vocabularyId,
              setId
            ])
          );
        });

        it('should download all uploaded vocabulary with setId successfully', async (): Promise<
          void
        > => {
          const downloadResponse = await Axios.get(
            env.API_URL +
              '/download-vocabulary?' +
              querystring.stringify({
                softLimit: 3,
                setId: setList[0].setId
              }),
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );

          const {
            vocabularyList: downloadedVocabularyList,
            vocabularySetIdPairs: downloadedVocabularySetIdPairs,
          } = new DownloadVocabularyResponseResolver().resolve(
            downloadResponse.data,
            true
          );

          const expectedVocabularyList = vocabularySetIdPairs
            .filter(([, setId]): boolean => {
              return setId === setList[0].setId
            })
            .map(
              ([vocabulary]): Vocabulary => {
                return {
                  ...vocabulary,
                  firstSyncedAt: expect.toBeDate(),
                  lastSyncedAt: expect.toBeDate(),
                  definitions: vocabulary.definitions.map(
                    (definition): Definition => {
                      return {
                        ...definition,
                        firstSyncedAt: expect.toBeDate(),
                        lastSyncedAt: expect.toBeDate(),
                      };
                    }
                  ),
                  category:
                    typeof vocabulary.category !== 'undefined'
                      ? {
                          ...vocabulary.category,
                          firstSyncedAt: expect.toBeDate(),
                          lastSyncedAt: expect.toBeDate(),
                        }
                      : undefined,
                  writing:
                    typeof vocabulary.writing !== 'undefined'
                      ? {
                          ...vocabulary.writing,
                          firstSyncedAt: expect.toBeDate(),
                          lastSyncedAt: expect.toBeDate(),
                        }
                      : undefined,
                };
              }
          );

          expect(downloadedVocabularyList).toIncludeAnyMembers(
            expectedVocabularyList
          );
          expect(downloadedVocabularySetIdPairs).toIncludeAnyMembers(
            vocabularySetIdPairs.map(([vocabulary,setId]): [ string, string ] =>[
              vocabulary.vocabularyId,
              setId
            ])
          );
        });

        it('should return noMore = true if no more vocabulary to download', async (): Promise<
          void
        > => {
          const firstDownloadResponse = await Axios.get(
            env.API_URL +
              '/download-vocabulary?' +
              querystring.stringify({
                softLimit: 3,
              }),
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );

          const maxSyncTime = _.maxBy(
            firstDownloadResponse.data.vocabularyList,
            (vocabulary: Vocabulary): Date => vocabulary.lastSyncedAt
          ).lastSyncedAt;

          const secondDownloadResponse = await Axios.get(
            env.API_URL +
              '/download-vocabulary?' +
              querystring.stringify({
                startAt: maxSyncTime,
                softLimit: 3,
              }),
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );

          expect(secondDownloadResponse.data.noMore).toBe(true);
        });

        describe('Test start after access token has been changed', (): void => {
          let newAccessToken;
          beforeEach(
            async (): Promise<void> => {
              const response = await Axios.post(
                env.API_URL + '/change-password',
                {
                  currentPassword: password,
                  newPassword: generateRandomPassword(),
                },
                { headers: { Authorization: 'Bearer ' + accessToken } }
              );
              newAccessToken = response.data.accessToken;
            }
          );

          it('cannot download vocabulary because the old acccess token is no longer valid', async (): Promise<
            void
          > => {
            await expect(
              Axios.get(env.API_URL + '/download-vocabulary', {
                headers: { Authorization: 'Bearer ' + accessToken },
              })
            ).rejects.toMatchObject({
              response: {
                status: 401,
                data: 'Unauthorized',
              },
            });
          });

          it('should download vocabulary list successfully with the new acccess token', async (): Promise<
            void
          > => {
            const response = await Axios.get(
              env.API_URL +
                '/download-vocabulary?' +
                querystring.stringify({
                  softLimit: 3,
                }),
              { headers: { Authorization: 'Bearer ' + newAccessToken } }
            );
            expect(response.data.vocabularyList.length > 0).toBe(true);
          });
        });
      });
    });
  });

  it('cannot download vocabulary if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/download-vocabulary')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
