import {
  UserBuilder,
  UserExtraDataItemBuilder,
} from '@ulangi/ulangi-common/builders';
import {
  UserExtraDataName,
  UserMembership,
  UserStatus,
} from '@ulangi/ulangi-common/enums';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import Axios from 'axios';
import * as moment from 'moment';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { mockCurrentTime } from '../utils/mockCurrentTime';
import { signUp } from '../utils/signUp';

describe('API endpoint /upload-user', (): void => {
  const env = resolveEnv()
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let currentUser;
    let email;
    let password;
    let accessToken;
    let restartCurrentTime: () => void;
    beforeEach(
      async (): Promise<void> => {
        restartCurrentTime = mockCurrentTime('2018-01-01T00:00:00');
        email = generateRandomEmail();
        password = generateRandomPassword();
        const response = await signUp(email, password);
        currentUser = response.data.currentUser;
        accessToken = response.data.accessToken;
      }
    );

    afterEach(
      (): void => {
        restartCurrentTime();
      }
    );

    it('should upload user successfully with access token', async (): Promise<
      void
    > => {
      const user = {
        userId: currentUser.userId,
        extraData: [
          new UserExtraDataItemBuilder().build({
            dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
            dataValue: {
              autoArchiveEnabled: true,
              spacedRepetitionLevelThreshold: 10,
              writingLevelThreshold: 8,
            },
          }),
        ],
      };

      const uploadResponse = await Axios.post(
        env.API_URL + '/upload-user',
        {
          user,
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      expect(uploadResponse.data.success).toBeTrue();

      const downloadResponse = await Axios.get(
        env.API_URL + '/download-user',
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );
      expect(downloadResponse.data.user).toEqual({
        ...currentUser,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        firstSyncedAt: expect.any(String),
        lastSyncedAt: expect.any(String),
        extraData: user.extraData.map(
          (data): UserExtraDataItem => {
            return {
              ...data,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              firstSyncedAt: expect.any(String),
              lastSyncedAt: expect.any(String),
            };
          }
        ),
      });
    });

    it('upload user can only update updatedAt but not the other fields', async (): Promise<
      void
    > => {
      const user = new UserBuilder().build({
        userId: currentUser.userId,
        email: 'edited@ulangi.com',
        userStatus: UserStatus.DISABLED,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
        updatedAt: moment()
          .add(1, 'hours')
          .toDate(),
        extraData: [
          new UserExtraDataItemBuilder().build({
            dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
            dataValue: {
              autoArchiveEnabled: true,
              spacedRepetitionLevelThreshold: 10,
              writingLevelThreshold: 8,
            },
          }),
        ],
      });

      const uploadResponse = await Axios.post(
        env.API_URL + '/upload-user',
        {
          user,
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      expect(uploadResponse.data.success).toBeTrue();

      const downloadResponse = await Axios.get(
        env.API_URL + '/download-user',
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );
      expect(downloadResponse.data.user).toEqual({
        ...currentUser,
        createdAt: expect.any(String),
        updatedAt: moment()
          .add(1, 'hours')
          .toISOString(),
        firstSyncedAt: expect.any(String),
        lastSyncedAt: expect.any(String),
        extraData: user.extraData.map(
          (data): UserExtraDataItem => {
            return {
              ...data,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              firstSyncedAt: expect.any(String),
              lastSyncedAt: expect.any(String),
            };
          }
        ),
      });
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

      it('cannot upload user because the old acccess token is no longer valid', async (): Promise<
        void
      > => {
        await expect(
          Axios.post(
            env.API_URL + '/upload-user',
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

      it('should upload user successfully with new access token', async (): Promise<
        void
      > => {
        const user = {
          userId: currentUser.userId,
          extraData: [
            new UserExtraDataItemBuilder().build({
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 10,
                writingLevelThreshold: 8,
              },
            }),
          ],
        };

        const uploadResponse = await Axios.post(
          env.API_URL + '/upload-user',
          {
            user,
          },
          { headers: { Authorization: 'Bearer ' + newAccessToken } }
        );

        expect(uploadResponse.data.success).toBeTrue();

        const downloadResponse = await Axios.get(
          env.API_URL + '/download-user',
          { headers: { Authorization: 'Bearer ' + newAccessToken } }
        );
        expect(downloadResponse.data.user).toEqual({
          ...currentUser,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          firstSyncedAt: expect.any(String),
          lastSyncedAt: expect.any(String),
          extraData: user.extraData.map(
            (data): UserExtraDataItem => {
              return {
                ...data,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                firstSyncedAt: expect.any(String),
                lastSyncedAt: expect.any(String),
              };
            }
          ),
        });
      });
    });
  });
});
