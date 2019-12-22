import { SetBuilder, VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import {
  DefinitionStatus,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Definition, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { DownloadSpecificVocabularyResponseResolver } from '@ulangi/ulangi-common/resolvers';
import Axios from 'axios';
import * as moment from 'moment';

import { resolveEnv } from '../utils/resolveEnv';
import { signUpRandomly } from '../utils/signUpRandomly';

describe('API endpoint /download-specific-vocabulary', (): void => {
  const env = resolveEnv()

  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        const response = await signUpRandomly();
        accessToken = response.data.accessToken;
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

      describe('Tests starts after uploading vocabulary list with one definition', (): void => {
        let vocabularyList;
        let vocabularySetIdPairs;
        beforeEach(
          async (): Promise<void> => {
            vocabularyList = [
              new VocabularyBuilder().build({
                vocabularyText: 'vocabulary 1',
                lastLearnedAt: null,
                createdAt: moment('2018-01-01').toDate(),
                updatedStatusAt: moment('2018-01-01').toDate(),
                updatedAt: moment('2018-01-01').toDate(),
                definitions: [
                  {
                    meaning: 'meaning 1',
                    source: 'source 1',
                    createdAt: moment('2018-01-01').toDate(),
                    updatedStatusAt: moment('2018-01-01').toDate(),
                    updatedAt: moment('2018-01-01').toDate(),
                  },
                ],
                category: {
                  categoryName: 'categoryName 1',
                  createdAt: moment('2018-02-01').toDate(),
                  updatedAt: moment('2018-02-01').toDate(),
                },
                writing: {
                  level: 5,
                  disabled: false,
                  lastWrittenAt: moment('2018-04-01').toDate(),
                  createdAt: moment('2018-03-01').toDate(),
                  updatedAt: moment('2018-03-01').toDate(),
                },
              }),
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
              new VocabularyBuilder().build({
                vocabularyText: 'vocabulary 3',
                vocabularyStatus: VocabularyStatus.DELETED,
                level: 2,
                lastLearnedAt: moment('2018-01-01T03:00:00').toDate(),
                createdAt: moment('2018-01-01T04:00:00').toDate(),
                updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
                updatedAt: moment('2018-01-01T01:00:00').toDate(),
              }),
            ];
            vocabularySetIdPairs = vocabularyList.map(
              (vocabulary): [string, string] => [
                vocabulary.vocabularyId,
                set.setId,
              ]
            );
            await Axios.post(
              env.API_URL + '/upload-vocabulary',
              {
                vocabularyList,
                vocabularySetIdPairs,
              },
              { headers: { Authorization: 'Bearer ' + accessToken } }
            );
          }
        );

        it('should download the specific vocabulary successfully with access token', async (): Promise<
          void
        > => {
          const response = await Axios.post(
            env.API_URL + '/download-specific-vocabulary',
            {
              vocabularyIds: vocabularyList.map(
                (vocabulary): string => vocabulary.vocabularyId
              ),
            },
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );

          const {
            vocabularyList: downloadedVocabularyList,
            vocabularySetIdPairs: downloadedVocabularySetIdPairs,
          } = new DownloadSpecificVocabularyResponseResolver().resolve(
            response.data,
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

          expect(downloadedVocabularySetIdPairs).toIncludeSameMembers(
            vocabularySetIdPairs
          );
        });
      });
    });
  });
});
