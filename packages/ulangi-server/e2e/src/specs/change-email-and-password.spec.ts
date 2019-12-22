import { ErrorCode } from '@ulangi/ulangi-common/enums';
import Axios from 'axios';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signIn } from '../utils/signIn';
import { signUp } from '../utils/signUp';

describe('API endpoint /change-email-and-password', (): void => {
  const env = resolveEnv()
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken = '';
    let email = '';
    let password = '';
    beforeEach(
      async (): Promise<void> => {
        email = generateRandomEmail();
        password = generateRandomPassword();
        const response = await signUp(email, password);
        accessToken = response.data.accessToken;
      }
    );

    it('should return success = true when change email and password successfully with acccess token', async (): Promise<
      void
    > => {
      const response = await Axios.post(
        env.API_URL + '/change-email-and-password',
        {
          newEmail: generateRandomEmail(),
          newPassword: generateRandomPassword(),
          currentPassword: password,
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      expect(response.data.success).toBe(true);
    });

    it('can sign in after changing email and password', async (): Promise<
      void
    > => {
      const newEmail = generateRandomEmail();
      const newPassword = generateRandomPassword();
      await Axios.post(
        env.API_URL + '/change-email-and-password',
        {
          newEmail,
          newPassword,
          currentPassword: password,
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      const response = await signIn(newEmail, newPassword);
      expect(response.data.currentUser.email).toEqual(newEmail);
    });

    it('should return a new valid access token when change email and password successfully', async (): Promise<
      void
    > => {
      const response = await Axios.post(
        env.API_URL + '/change-email-and-password',
        {
          newEmail: generateRandomEmail(),
          newPassword: generateRandomPassword(),
          currentPassword: password,
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      const checkAccessTokenResponse = await Axios.post(
        env.API_URL + '/check-access-token',
        {
          accessToken: response.data.accessToken,
        }
      );
      expect(checkAccessTokenResponse.data.valid).toBe(true);
    });

    it('should invalidate old access token when change password successfully', async (): Promise<
      void
    > => {
      await Axios.post(
        env.API_URL + '/change-email-and-password',
        {
          newEmail: generateRandomEmail(),
          newPassword: generateRandomPassword(),
          currentPassword: password,
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

    it('should return status 401 and WRONG_PASSWORD when current password is incorrect', async (): Promise<
      void
    > => {
      await expect(
        Axios.post(
          env.API_URL + '/change-email-and-password',
          {
            newEmail: generateRandomEmail(),
            newPassword: generateRandomPassword(),
            currentPassword: generateRandomPassword(),
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        )
      ).rejects.toMatchObject({
        response: {
          status: 401,
          data: { errorCode: ErrorCode.USER__WRONG_PASSWORD },
        },
      });
    });

    it('cannot change email and password if acccess token is not provided', async (): Promise<
      void
    > => {
      await expect(
        Axios.post(env.API_URL + '/change-email-and-password', {
          newEmail: generateRandomEmail(),
          newPassword: generateRandomPassword(),
          currentPassword: password,
        })
      ).rejects.toMatchObject({
        response: {
          status: 401,
          data: 'Unauthorized',
        },
      });
    });
  });
});
