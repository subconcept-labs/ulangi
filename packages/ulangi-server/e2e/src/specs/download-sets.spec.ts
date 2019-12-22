import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName, SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { DownloadSetsResponseResolver } from '@ulangi/ulangi-common/resolvers';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import Axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as querystring from 'query-string';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /download-sets', (): void => {
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

    describe('Tests start after uploading new set list', (): void => {
      let setList;
      beforeEach(
        async (): Promise<void> => {
          setList = [
            new SetBuilder().build({
              setName: 'set 1',
              learningLanguageCode: 'en',
              translatedToLanguageCode: 'any',
              createdAt: moment('2018-01-01T04:00:00').toDate(),
              updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
              updatedAt: moment('2018-01-01T01:00:00').toDate(),
            }),
            new SetBuilder().build({
              setName: 'set 2 ',
              learningLanguageCode: 'es',
              translatedToLanguageCode: 'en',
              setStatus: SetStatus.ARCHIVED,
              createdAt: moment('2018-01-01T04:00:00').toDate(),
              updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
              updatedAt: moment('2018-01-01T01:00:00').toDate(),
              extraData: [
                {
                  dataName: SetExtraDataName.SPACED_REPETITION_AUTO_ARCHIVE,
                  dataValue: false,
                  createdAt: moment('2018-01-01T06:00:00').toDate(),
                  updatedAt: moment('2018-01-01T05:00:00').toDate(),
                },
              ],
            }),
          ];
          await Axios.post(
            env.API_URL + '/upload-sets',
            {
              setList,
            },
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );
        }
      );

      it('should download all uploaded sets successfully with access token', async (): Promise<
        void
      > => {
        // Need 2 download requests to download all uploaded sets
        const firstDownloadResponse = await Axios.get(
          env.API_URL +
            '/download-sets?' +
            querystring.stringify({
              softLimit: 3,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        const {
          setList: firstDownloadedSetList,
        } = new DownloadSetsResponseResolver().resolve(
          firstDownloadResponse.data,
          true
        );

        const maxLastSyncedAt = _.maxBy(firstDownloadedSetList, 'lastSyncedAt')
          .lastSyncedAt;

        const secondDownloadResponse = await Axios.get(
          env.API_URL +
            '/download-sets?' +
            querystring.stringify({
              softLimit: 3,
              startAt: maxLastSyncedAt,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        const {
          setList: secondDownloadedSetList,
        } = new DownloadSetsResponseResolver().resolve(
          secondDownloadResponse.data,
          true
        );

        const expectedSetList = setList.map(
          (set): Set => {
            return {
              ...set,
              firstSyncedAt: expect.toBeDate(),
              lastSyncedAt: expect.toBeDate(),
              extraData: set.extraData.map(
                (extraData): SetExtraDataItem => {
                  return {
                    ...extraData,
                    firstSyncedAt: expect.toBeDate(),
                    lastSyncedAt: expect.toBeDate(),
                  };
                }
              ),
            };
          }
        );

        expect(firstDownloadedSetList).toIncludeAnyMembers(expectedSetList);
        expect(secondDownloadedSetList).toIncludeSameMembers(expectedSetList);
      });

      it('should return noMore = true if no more sets to download', async (): Promise<
        void
      > => {
        const firstDownloadResponse = await Axios.get(
          env.API_URL +
            '/download-sets?' +
            querystring.stringify({
              softLimit: 3,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        const maxSyncTime = _.maxBy(
          firstDownloadResponse.data.setList,
          (set: Set): Date => set.lastSyncedAt
        ).lastSyncedAt;

        // If download again should return empty list and no more
        const secondDownloadResponse = await Axios.get(
          env.API_URL +
            '/download-sets?' +
            querystring.stringify({
              startAt: maxSyncTime,
              softLimit: 3,
            }),
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        expect(secondDownloadResponse.data.noMore).toBe(true);
      });

      describe('Tests start after access token has been changed', (): void => {
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

        it('cannot download set because the old acccess token is no longer valid', async (): Promise<
          void
        > => {
          await expect(
            Axios.get(env.API_URL + '/download-sets', {
              headers: { Authorization: 'Bearer ' + accessToken },
            })
          ).rejects.toMatchObject({
            response: {
              status: 401,
              data: 'Unauthorized',
            },
          });
        });

        it('should download set successfully with the new acccess token', async (): Promise<
          void
        > => {
          const response = await Axios.get(
            env.API_URL +
              '/download-sets?' +
              querystring.stringify({
                softLimit: 3,
              }),
            { headers: { Authorization: 'Bearer ' + newAccessToken } }
          );
          expect(response.data.setList.length > 0).toBe(true);
        });
      });
    });
  });

  it('cannot download set if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/download-sets')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
