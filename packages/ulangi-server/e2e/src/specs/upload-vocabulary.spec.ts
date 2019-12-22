import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { Definition, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { DownloadVocabularyResponseResolver } from '@ulangi/ulangi-common/resolvers';
import Axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as querystring from 'query-string';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { mockCurrentTime } from '../utils/mockCurrentTime';
import { signUp } from '../utils/signUp';

describe('API endpoint /upload-vocabulary', (): void => {
  const env = resolveEnv()
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let email;
    let password;
    let accessToken;
    let restartCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        restartCurrentTime = mockCurrentTime('2018-01-01T00:00:00');
        const response = await signUp(email, password);
        accessToken = response.data.accessToken;
      }
    );

    afterEach(
      (): void => {
        restartCurrentTime();
      }
    );

    describe('Tests start after new set is uploaded', (): void => {
      let set;
      beforeEach(
        async (): Promise<void> => {
          set = new SetBuilder().build({
            setName: 'test',
            learningLanguageCode: 'en',
            translatedToLanguageCode: 'vi',
          });
          await Axios.post(
            env.API_URL + '/upload-sets',
            {
              setList: [set],
            },
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );
        }
      );

      it('should upload vocabulary list with definitions, category and writing successfully', async (): Promise<
        void
      > => {
        const vocabularyList = [
          new VocabularyBuilder().build({
            vocabularyText: 'vocabulary',
            definitions: [{ meaning: 'meaning', source: 'source' }],
            category: {
              categoryName: 'categoryName 1',
            },
            writing: {
              level: 1,
            },
          }),
          new VocabularyBuilder().build({
            vocabularyText: 'vocabulary',
            definitions: [],
          }),
        ];

        const vocabularySetIdPairs = vocabularyList.map(
          (vocabulary): [string, string] => {
            return [vocabulary.vocabularyId, set.setId];
          }
        );
        const uploadResponse = await Axios.post(
          env.API_URL + '/upload-vocabulary',
          {
            vocabularyList,
            vocabularySetIdPairs,
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        expect(uploadResponse.data.acknowledged).toEqual(
          vocabularyList.map((vocabulary): string => vocabulary.vocabularyId)
        );

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

        const expectedVocabularyList = vocabularyList.map(
          (vocabulary): Vocabulary => {
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

        expect(
          _.uniqBy(
            [
              ...firstDownloadedVocabularyList,
              ...secondDownloadedVocabularyList,
            ],
            'vocabularyId'
          )
        ).toIncludeSameMembers(expectedVocabularyList);

        expect(
          _.uniqWith(
            [
              ...firstDownloadedVocabularySetIdPairs,
              ...secondDownloadedVocabularySetIdPairs,
            ],
            _.isEqual
          )
        ).toIncludeSameMembers(vocabularySetIdPairs);
      });

      it('should upload vocabulary list without definitions, category, and writing successfully', async (): Promise<
        void
      > => {
        const vocabularyList = [
          new VocabularyBuilder().build({
            vocabularyText: 'vocabulary',
          }),
        ];
        const vocabularySetIdPairs = vocabularyList.map(
          (vocabulary): [string, string] => {
            return [vocabulary.vocabularyId, set.setId];
          }
        );
        const uploadResponse = await Axios.post(
          env.API_URL + '/upload-vocabulary',
          {
            vocabularyList,
            vocabularySetIdPairs,
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        expect(uploadResponse.data.acknowledged).toEqual(
          vocabularyList.map((vocabulary): string => vocabulary.vocabularyId)
        );

        // Make sure upload persists
        const downloadResponse = await Axios.get(
          env.API_URL +
            '/download-vocabulary?' +
            querystring.stringify({
              softLimit: 3,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );
        const {
          vocabularyList: downloadedVocabularyList,
        } = new DownloadVocabularyResponseResolver().resolve(
          downloadResponse.data,
          true
        );

        expect(downloadedVocabularyList).toIncludeSameMembers(
          vocabularyList.map(
            (vocabulary): Vocabulary => {
              return {
                ...vocabulary,
                firstSyncedAt: expect.toBeDate(),
                lastSyncedAt: expect.toBeDate(),
              };
            }
          )
        );
      });

      it('should upload vocabulary list with unknown properties successfully with access token', async (): Promise<
        void
      > => {
        const vocabularyWithUnknownProps: any = _.merge(
          new VocabularyBuilder().build({
            vocabularyText: 'vocabulary',
          }),
          {
            unknownProps: 'unknownProps',
          }
        );
        const vocabularyList = [vocabularyWithUnknownProps];

        const vocabularySetIdPairs = vocabularyList.map(
          (vocabulary): [string, string] => {
            return [vocabulary.vocabularyId, set.setId];
          }
        );
        const uploadResponse = await Axios.post(
          env.API_URL + '/upload-vocabulary',
          {
            vocabularyList,
            vocabularySetIdPairs,
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        expect(uploadResponse.data.acknowledged).toEqual(
          vocabularyList.map((vocabulary): string => vocabulary.vocabularyId)
        );

        // Make sure upload persists
        const downloadResponse = await Axios.get(
          env.API_URL +
            '/download-vocabulary?' +
            querystring.stringify({
              softLimit: 3,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );
        const {
          vocabularyList: downloadedVocabularyList,
        } = new DownloadVocabularyResponseResolver().resolve(
          downloadResponse.data,
          true
        );

        expect(downloadedVocabularyList).toEqual([
          {
            ..._.omit(vocabularyWithUnknownProps, 'unknownProps'),
            firstSyncedAt: expect.toBeDate(),
            lastSyncedAt: expect.toBeDate(),
          },
        ]);
      });

      it('should ignore vocabulary with invalid setId', async (): Promise<
        void
      > => {
        const vocabularyList = [
          new VocabularyBuilder().build({
            vocabularyText: 'vocabulary1',
          }),
          new VocabularyBuilder().build({
            vocabularyText: 'vocabulary2',
          }),
        ];

        const vocabularySetIdPairs = [
          [vocabularyList[0].vocabularyId, "invalidsetid"],
          [vocabularyList[1].vocabularyId, set.setId]
        ]

        const uploadResponse = await Axios.post(
          env.API_URL + '/upload-vocabulary',
          {
            vocabularyList,
            vocabularySetIdPairs,
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        expect(uploadResponse.data.acknowledged).toEqual(
          [vocabularyList[1].vocabularyId]
        );

        // Make sure upload persists
        const downloadResponse = await Axios.get(
          env.API_URL +
            '/download-vocabulary?' +
            querystring.stringify({
              softLimit: 3,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        const {
          vocabularyList: downloadedVocabularyList,
        } = new DownloadVocabularyResponseResolver().resolve(
          downloadResponse.data,
          true
        );

        expect(downloadedVocabularyList).toIncludeSameMembers(
          [vocabularyList[1]].map(
            (vocabulary): Vocabulary => {
              return {
                ...vocabulary,
                firstSyncedAt: expect.toBeDate(),
                lastSyncedAt: expect.toBeDate(),
              };
            }
          )
        );
      });

      it('should upload vocabulary list with invalid properties successfully', async (): Promise<
        void
      > => {
        const vocabularyWithInvalidProps: any = _.merge(
          new VocabularyBuilder().build({
            vocabularyText: 'invalid vocabulary',
          }),
          {
            level: 'level', // Level should be a number
          }
        );
        const validVocabulary = new VocabularyBuilder().build({
          vocabularyText: 'valid vocabulary',
        });

        const vocabularyList = [vocabularyWithInvalidProps, validVocabulary];

        const vocabularySetIdPairs = vocabularyList.map(
          (vocabulary): [string, string] => {
            return [vocabulary.vocabularyId, set.setId];
          }
        );
        const uploadResponse = await Axios.post(
          env.API_URL + '/upload-vocabulary',
          {
            vocabularyList,
            vocabularySetIdPairs,
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        expect(uploadResponse.data.acknowledged).toEqual([
          validVocabulary.vocabularyId,
        ]);

        // Make sure upload persists
        const downloadResponse = await Axios.get(
          env.API_URL +
            '/download-vocabulary?' +
            querystring.stringify({
              softLimit: 3,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );
        const {
          vocabularyList: downloadedVocabularyList,
        } = new DownloadVocabularyResponseResolver().resolve(
          downloadResponse.data,
          true
        );

        expect(downloadedVocabularyList).toEqual([
          {
            ...validVocabulary,
            firstSyncedAt: expect.toBeDate(),
            lastSyncedAt: expect.toBeDate(),
          },
        ]);
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

        it('cannot upload vocabulary because the old acccess token is no longer valid', async (): Promise<
          void
        > => {
          await expect(
            Axios.post(
              env.API_URL + '/upload-vocabulary',
              {},
              { headers: { Authorization: 'Bearer ' + accessToken } }
            )
          ).rejects.toMatchObject({
            response: {
              status: 401,
              data: 'Unauthorized',
            },
          });
        });

        it('should upload vocabulary successfully with the new acccess token', async (): Promise<
          void
        > => {
          const vocabularyList = [
            new VocabularyBuilder().build({
              vocabularyText: 'vocabulary',
              definitions: [{ meaning: 'meaning', source: 'source' }],
              category: {
                categoryName: 'categoryName 1',
              },
              writing: {
                lastWrittenAt: moment().toDate(),
              },
            }),
          ];
          const vocabularySetIdPairs = vocabularyList.map(
            (vocabulary): [string, string] => {
              return [vocabulary.vocabularyId, set.setId];
            }
          );
          const response = await Axios.post(
            env.API_URL + '/upload-vocabulary',
            {
              vocabularyList,
              vocabularySetIdPairs,
            },
            { headers: { Authorization: 'Bearer ' + newAccessToken } }
          );

          expect(response.data.acknowledged).toEqual(
            vocabularyList.map((vocabulary): string => vocabulary.vocabularyId)
          );

          // Make sure upload persists
          const downloadResponse = await Axios.get(
            env.API_URL +
              '/download-vocabulary?' +
              querystring.stringify({
                softLimit: 3,
              }),
            { headers: { Authorization: 'Bearer ' + newAccessToken } }
          );
          const {
            vocabularyList: downloadedVocabularyList,
          } = new DownloadVocabularyResponseResolver().resolve(
            downloadResponse.data,
            true
          );

          expect(downloadedVocabularyList).toIncludeSameMembers(
            vocabularyList.map(
              (vocabulary): Vocabulary => {
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
            )
          );
        });
      });
    });
  });

  it('cannot upload vocabulary if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.post(env.API_URL + '/upload-vocabulary')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
