import Axios from 'axios';

import { ApiScope } from "@ulangi/ulangi-common/enums"
import { resolveEnv } from '../utils/resolveEnv';
import { generateRandomEmail } from '../utils/generateRandomEmail';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { signUp } from '../utils/signUp';

describe('API endpoint /delete-api-key', (): void => {
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

    it('should delete api key', async (): Promise<
      void
    > => {
      const getResponse1 = await Axios.post(
        env.API_URL + '/get-api-key', {
          password,
          apiScope: ApiScope.SYNC,
          createIfNotExists: true
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );

      const deleteResponse = await Axios.post(
        env.API_URL + '/delete-api-key',
        {
          apiKey: getResponse1.data.apiKey
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );


      expect(deleteResponse.data.success).toBeTrue();

      const getResponse2 = await Axios.post(
        env.API_URL + '/get-api-key', {
          password,
          apiScope: ApiScope.SYNC
        },
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      )

      expect(getResponse2.data.apiKey).toBeNull()
      expect(getResponse2.data.expiredAt).toBeNull()
    });

    it('cannot delete api key if accessToken is not provided', async (): Promise<
      void
    > => {
      await expect(
        Axios.post(env.API_URL + '/delete-api-key')
      ).rejects.toMatchObject({
        response: {
          status: 401,
          data: 'Unauthorized',
        }
      });
    });
  })
});
