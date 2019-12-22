import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
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

describe('API endpoint /upload-sets', (): void => {

  const env = resolveEnv()

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

    it('should upload set list successfully with access token', async (): Promise<
      void
    > => {
      const setList = [
        new SetBuilder().build({
          setName: 'set 1',
          learningLanguageCode: 'en',
          translatedToLanguageCode: 'vi',
          createdAt: moment('2018-01-01T06:00:00').toDate(),
          updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
          updatedAt: moment('2018-01-01T05:00:00').toDate(),
        }),
        new SetBuilder().build({
          setName: 'set 2',
          learningLanguageCode: 'zh',
          translatedToLanguageCode: 'vi',
          createdAt: moment('2018-01-01T06:00:00').toDate(),
          updatedAt: moment('2018-01-01T05:00:00').toDate(),
          updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
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
      const uploadResponse = await Axios.post(
        env.API_URL + '/upload-sets',
        {
          setList
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      expect(uploadResponse.data.acknowledged).toEqual(
        setList.map((set): string => set.setId)
      );

      // Need 2 download requests to download all sets
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

      expect(
        _.uniqBy(
          [...firstDownloadedSetList, ...secondDownloadedSetList],
          'setId'
        )
      ).toIncludeSameMembers(expectedSetList);
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

      it('cannot upload set because the old acccess token is no longer valid', async (): Promise<
        void
      > => {
        await expect(
          Axios.post(
            env.API_URL + '/upload-sets',
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

      it('should upload set successfully with the new acccess token', async (): Promise<
        void
      > => {
        const setList = Array(3)
          .fill(null)
          .map(
            (): Set => {
              return new SetBuilder().build({
                setName: 'test',
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'vi',
              });
            }
          );
        const uploadResponse = await Axios.post(
          env.API_URL + '/upload-sets',
          {
            setList,
          },
          { headers: { Authorization: 'Bearer ' + newAccessToken } }
        );

        expect(uploadResponse.data.acknowledged).toEqual(
          setList.map((set): string => set.setId)
        );
      });
    });
  });

  it('cannot upload set if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.post(env.API_URL + '/upload-sets')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
