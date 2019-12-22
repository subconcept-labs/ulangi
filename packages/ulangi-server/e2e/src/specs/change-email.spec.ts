import { ErrorCode } from '@ulangi/ulangi-common/enums';
import Axios from 'axios';

import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signIn } from '../utils/signIn';
import { signUp } from '../utils/signUp';

describe('API endpoint /change-email', (): void => {
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

    it('should return success = true when change email successfully with access token', async (): Promise<
      void
    > => {
      const response = await Axios.post(
        env.API_URL + '/change-email',
        {
          newEmail: generateRandomEmail(),
          password,
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      expect(response.data.success).toBe(true);
    });

    it('should return a new valid access token when change email successfully with access token', async (): Promise<
      void
    > => {
      const response = await Axios.post(
        env.API_URL + '/change-email',
        {
          newEmail: generateRandomEmail(),
          password,
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

    it('can sign in after changing email', async (): Promise<void> => {
      const newEmail = generateRandomEmail();
      await Axios.post(
        env.API_URL + '/change-email',
        {
          newEmail,
          password,
        },
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      const response = await signIn(newEmail, password);
      expect(response.data.currentUser.email).toEqual(newEmail);
    });

    it('should invalidate old access token when change email successfully', async (): Promise<
      void
    > => {
      await Axios.post(
        env.API_URL + '/change-email',
        {
          newEmail: generateRandomEmail(),
          password,
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
          env.API_URL + '/change-email',
          {
            newEmail: generateRandomEmail(),
            password: generateRandomPassword(),
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

    it('should return status 401 and EMAIL_ALREADY_REGISTERED when email already existed', async (): Promise<
      void
    > => {
      // First create anothe account
      const newEmail = generateRandomEmail();
      await signUp(newEmail, generateRandomPassword());

      await expect(
        Axios.post(
          env.API_URL + '/change-email',
          {
            newEmail,
            password,
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        )
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { errorCode: ErrorCode.USER__EMAIL_ALREADY_REGISTERED },
        },
      });
    });

    it('should return status 400 and INVALID_REQUEST when new email is invalid', async (): Promise<
      void
    > => {
      await expect(
        Axios.post(
          env.API_URL + '/change-email',
          {
            newEmail: 'string',
            password: generateRandomPassword(),
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        )
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { errorCode: ErrorCode.GENERAL__INVALID_REQUEST },
        },
      });
    });

    it('cannot change email if acccess token is not provided', async (): Promise<
      void
    > => {
      await expect(
        Axios.post(env.API_URL + '/change-email', {
          newEmail: generateRandomEmail(),
          password,
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
