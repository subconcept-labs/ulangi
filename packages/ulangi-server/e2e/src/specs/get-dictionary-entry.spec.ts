import Axios from 'axios';
import * as _ from 'lodash';
import * as querystring from 'query-string';

import { resolveEnv } from '../utils/resolveEnv';
import { signUpRandomly } from '../utils/signUpRandomly';

describe('API endpoint get-dictionary-entry', (): void => {
  const env = resolveEnv();
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        const response = await signUpRandomly();
        accessToken = response.data.accessToken;
      }
    );

    const searchTermsToTest = {
      zh: ['犬', '不', '你好'],
      en: ['good'],
      fr: ['fauteuil'],
      de: ['Schultasche'],
      it: ['gatto'],
      ko: ['새'],
      ja: ['とり'],
      ru: ['летучая мышь'],
      es: ['enojado'],
      vi: ['bơ'],
    };

    _.forOwn(
      searchTermsToTest,
      (searchTerms, languageCode): void => {
        describe(`For language pair ${languageCode}_en`, (): void => {
          searchTerms.forEach(
            (searchTerm): void => {
              it(`should return at least one definition when searchTerm is ${searchTerm} (with valid access token)`, async (): Promise<
                void
              > => {
                const response = await Axios.get(
                  env.API_URL +
                    '/get-dictionary-entry?' +
                    querystring.stringify({
                      searchTerm,
                      searchTermLanguageCode: languageCode,
                      translatedToLanguageCode: 'en',
                    }),
                  { headers: { Authorization: 'Bearer ' + accessToken } }
                );
                expect(
                  response.data.dictionaryEntry.definitions.length > 0
                ).toBe(true);
              });
            }
          );
        });
      }
    );
  });

  it('cannot get dictionary entry if acccess token is not provided', async (): Promise<
    void
  > => {
    await expect(
      Axios.get(env.API_URL + '/get-dictionary-entry')
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: 'Unauthorized',
      },
    });
  });
});
