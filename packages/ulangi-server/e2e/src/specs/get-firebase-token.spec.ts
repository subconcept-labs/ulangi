import Axios from 'axios';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /get-firebase-token', (): void => {
  const env = resolveEnv();
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    let email;
    let password;

    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        const response = await signUp(email, password);
        accessToken = response.data.accessToken;
      }
    );

    it('should get firebase token successfully with access token', async (): Promise<
      void
    > => {
      const response = await Axios.get(
        env.API_URL + '/get-firebase-token',
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );

      expect(response.data.firebaseToken).toBeDefined();
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

      it('cannot get firebase token because the old acccess token is no longer valid', async (): Promise<
        void
      > => {
        await expect(
          Axios.get(env.API_URL + '/get-firebase-token', {
            headers: { Authorization: 'Bearer ' + accessToken },
          })
        ).rejects.toMatchObject({
          response: {
            status: 401,
            data: 'Unauthorized',
          },
        });
      });

      it('should get firebase token successfully with new access token', async (): Promise<
        void
      > => {
        const response = await Axios.get(
          env.API_URL + '/get-firebase-token',
          { headers: { Authorization: 'Bearer ' + newAccessToken } }
        );

        expect(response.data.firebaseToken).toBeDefined();
      });
    });
  });

  it('cannot get firebase token if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/get-firebase-token')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
