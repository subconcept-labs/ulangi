import Axios from 'axios';
import * as moment from "moment"

import { ErrorCode, ApiScope } from "@ulangi/ulangi-common/enums"
import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /get-api-key', (): void => {
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
        accessToken = response.data.accessToken
      }
    );

    it('should return null when there are no api keys', async (): Promise<
      void
    > => {
      const response = await Axios.post(
        env.API_URL + '/get-api-key', {
          password,
          apiScope: ApiScope.SYNC
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );

      expect(response.data.apiKey).toBeNull();
      expect(response.data.expiredAt).toBeNull();
    });

    it('should return api key when createIfNotExists is true', async (): Promise<
      void
    > => {
      const response = await Axios.post(
        env.API_URL + '/get-api-key', {
          password,
          apiScope: ApiScope.SYNC,
          createIfNotExists: true
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );

      expect(response.data.apiKey).toBeString();
      expect(response.data.expiredAt).toBeString();
    });

    it('should return a valid exising key', async (): Promise<
      void
    > => {
      const response1 = await Axios.post(
        env.API_URL + '/get-api-key', {
          password,
          apiScope: ApiScope.SYNC,
          createIfNotExists: true
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );

      const response2 = await Axios.post(
        env.API_URL + '/get-api-key', {
          password,
          apiScope: ApiScope.SYNC
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );

      expect({
        ...response2.data,
        expiredAt: moment(response2.data.expiredAt).startOf('minute').toDate()
      }).toEqual({
        ...response1.data,
        expiredAt: moment(response1.data.expiredAt).startOf('minute').toDate()
      });
    });

    it('cannot get api key if password is incorrect', async (): Promise<
      void
    > => {
      await expect(
        Axios.post(env.API_URL + '/get-api-key', {
          password: generateRandomPassword(),
          apiScope: ApiScope.SYNC
        }, 
        {
          headers: { Authorization: 'Bearer ' + accessToken }
        }
      )).rejects.toMatchObject({
        response: {
          status: 401,
          data: { errorCode: ErrorCode.USER__WRONG_PASSWORD },
        }
      });
    });
  })
});
