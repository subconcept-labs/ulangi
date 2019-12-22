import Axios from 'axios';
import * as _ from 'lodash';
import * as querystring from 'query-string';

import { resolveEnv } from '../utils/resolveEnv';
import { signUpRandomly } from '../utils/signUpRandomly';

describe('API endpoint /search-pixabay-images', (): void => {
  const env = resolveEnv();
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        const response = await signUpRandomly();
        accessToken = response.data.accessToken;
      }
    );

    it('should return hits', async (): Promise<
      void
    > => {
      const response = await Axios.get(
        env.API_URL +
          '/search-pixabay-images?' +
          querystring.stringify({
            q: 'cat',
            page: 1,
            safesearch: true,
            image_type: "photo"
          }),
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );

      expect(response.data.hits.length > 0).toBe(true);
    });
  })

  it('cannot search pixabay images if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/search-pixabay-images')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
