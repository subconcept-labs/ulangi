import Axios from 'axios';
import * as querystring from 'query-string';

import { loadConfig } from '../utils/loadConfig';
import { resolveEnv } from '../utils/resolveEnv';
import { signUpRandomly } from '../utils/signUpRandomly';

describe('API endpoint /synthesize-speech', (): void => {
  const env = resolveEnv();
  const config = loadConfig();
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        const response = await signUpRandomly();
        accessToken = response.data.accessToken;
      }
    );

    config.languageCodesForSpeechTesting.forEach(
      (languageCode): void => {
        it(`should synthesizes speech with ${languageCode} language code (with access token)`, async (): Promise<
          void
        > => {
          const response = await Axios.get(
            env.API_URL +
              '/synthesize-speech?' +
              querystring.stringify({
                text: 'test',
                languageCode,
              }),
            {
              headers: { Authorization: 'Bearer ' + accessToken },
            }
          );
          expect(response.status).toEqual(200);
          expect(response.data).toBeDefined();
        });
      }
    );
  });

  it('cannot synthesize speech if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/synthesize-speech')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
