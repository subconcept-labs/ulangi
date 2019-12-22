import Axios from 'axios';
import * as querystring from 'query-string';

import { resolveEnv } from '../utils/resolveEnv';
import { signUpRandomly } from '../utils/signUpRandomly';

describe('API endpoint /translate-bidirection', (): void => {
  const env = resolveEnv();
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        const response = await signUpRandomly();
        accessToken = response.data.accessToken;
      }
    );

    it('should return translations when translate successfully with access token', async (): Promise<
      void
    > => {
      const response = await Axios.get(
        env.API_URL +
          '/translate-bidirection?' +
          querystring.stringify({
            sourceText: 'dog',
            languageCodePair: 'zh-en',
          }),
        {
          headers: { Authorization: 'Bearer ' + accessToken },
        }
      );

      expect(response.data.translations.length > 0).toBe(true);
    });
  });

  it('cannot translate bidirection if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/translate-bidirection')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
