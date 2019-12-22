import Axios from 'axios';
import * as moment from 'moment';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /download-user', (): void => {
  const env = resolveEnv();

  describe('Tests start after signing up and access token and current user are retrieved', (): void => {
    let email;
    let password;
    let accessToken;
    let currentUser;
    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        const response = await signUp(email, password);
        accessToken = response.data.accessToken;
        currentUser = response.data.currentUser;
      }
    );

    it('should download user successfully with access token', async (): Promise<
      void
    > => {
      const response = await Axios.get(env.API_URL + '/download-user', {
        headers: { Authorization: 'Bearer ' + accessToken },
      });

      expect(response.data.user).toEqual(currentUser);
    });

    it('should include currentUser in the response (backward compatible)', async (): Promise<
      void
    > => {
      const response = await Axios.get(env.API_URL + '/download-user', {
        headers: { Authorization: 'Bearer ' + accessToken },
      });

      expect(response.data.currentUser).toEqual(currentUser);
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

      it('cannot download user because the old acccess token is no longer valid', async (): Promise<
        void
      > => {
        await expect(
          Axios.get(env.API_URL + '/download-user', {
            headers: { Authorization: 'Bearer ' + accessToken },
          })
        ).rejects.toMatchObject({
          response: {
            status: 401,
            data: 'Unauthorized',
          },
        });
      });

      it('should download user successfully with the new acccess token', async (): Promise<
        void
      > => {
        const response = await Axios.get(env.API_URL + '/download-user', {
          headers: { Authorization: 'Bearer ' + newAccessToken },
        });

        expect(response.data.user).toEqual({
          ...currentUser,
          updatedAt: expect.any(String),
          lastSyncedAt: expect.any(String),
        });
        expect(moment(response.data.user.updatedAt).toDate()).toBeDate();
      });
    });
  });

  it('cannot download user if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/download-user')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
