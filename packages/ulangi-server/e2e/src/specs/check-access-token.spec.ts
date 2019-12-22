import { ErrorCode } from '@ulangi/ulangi-common/enums';
import Axios from 'axios';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /check-access-token', (): void => {
  const env = resolveEnv()

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

    it('should return valid = true when accessToken is valid ', async (): Promise<
      void
    > => {
      const response = await Axios.post(
        env.API_URL + '/check-access-token',
        {
          accessToken,
        }
      );
      expect(response.data.valid).toBe(true);
    });

    it('should return status 400 and INVALID_REQUEST when accessToken is empty', async (): Promise<
      void
    > => {
      await expect(
        Axios.post(env.API_URL + '/check-access-token', {
          accessToken: '',
        })
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { errorCode: ErrorCode.GENERAL__INVALID_REQUEST },
        },
      });
    });

    it('should return valid = false when accessToken is invalid', async (): Promise<
      void
    > => {
      await Axios.post(
        env.API_URL + '/change-password',
        {
          currentPassword: password,
          newPassword: generateRandomPassword(),
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      const response = await Axios.post(
        env.API_URL + '/check-access-token',
        {
          accessToken,
        }
      );
      expect(response.data.valid).toBe(false);
    });
  });
});
