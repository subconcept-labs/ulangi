import Axios from 'axios';
import * as _ from 'lodash';
import * as querystring from 'query-string';

import { resolveEnv } from '../utils/resolveEnv';
import { signUpRandomly } from '../utils/signUpRandomly';

describe('API endpoint /search-native-vocabulary', (): void => {
  const env = resolveEnv()
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        const response = await signUpRandomly();
        accessToken = response.data.accessToken;
      }
    );

    it('should return vocabulary when searchTerm is "dog"', async (): Promise<
      void
    > => {
      const response = await Axios.get(
        env.API_URL +
          '/search-native-vocabulary?' +
          querystring.stringify({
            languageCodePair: 'zh-en',
            searchTerm: 'dog',
            offset: 0,
            limit: 10,
          }),
        { headers: { Authorization: 'Bearer ' + accessToken } }
      );
      expect(response.data.vocabularyList.length > 0).toBe(true);
    });

    const searchTermsToTest = {
      ar: ["dog"],
      cs: ["dog"],
      zh: ["dog"],
      da: ["dog"],
      nl: ["dog"],
      en: ["dog"],
      fr: ["dog"],
      de: ["dog"],
      el: ["dog"],
      hi: ["dog"],
      hu: ["dog"],
      id: ["dog"],
      it: ["dog"],
      ja: ["dog"],
      ko: ["dog"],
      nb: ["dog"],
      pl: ["dog"],
      pt: ["dog"],
      ru: ["dog"],
      sk: ["dog"],
      es: ["dog"],
      sv: ["dog"],
      tr: ["dog"],
      uk: ["dog"],
      vi: ["dog"]
    };
    _.forOwn(
      searchTermsToTest,
      (searchTerms, languageCode): void => {
        describe(`For language pair ${languageCode}-en`, (): void => {
          searchTerms.forEach(
            (searchTerm): void => {
              it(`should return at least one vocabulary when searchTerm is ${searchTerm} (with access token)`, async (): Promise<
                void
              > => {
                const response = await Axios.get(
                  env.API_URL +
                    '/search-native-vocabulary?' +
                    querystring.stringify({
                      languageCodePair: `${languageCode}-en`,
                      searchTerm,
                      offset: 0,
                      limit: 10,
                    }),
                  { headers: { Authorization: 'Bearer ' + accessToken } }
                );
                expect(response.data.vocabularyList.length > 0).toBe(true);
              });
            }
          );
        });
      }
    );
  });

  it('cannot search native vocabulary if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/search-native-vocabulary')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
