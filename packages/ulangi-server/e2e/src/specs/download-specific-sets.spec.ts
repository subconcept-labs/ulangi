import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName, SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { DownloadSpecificSetsResponseResolver } from '@ulangi/ulangi-common/resolvers';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import Axios from 'axios';
import * as moment from 'moment';

import { resolveEnv } from '../utils/resolveEnv';
import { signUpRandomly } from '../utils/signUpRandomly';

describe('API endpoint /download-specific-sets', (): void => {
  const env = resolveEnv()
  describe('Tests start after signing up and access token is retrieved', (): void => {
    let accessToken;
    beforeEach(
      async (): Promise<void> => {
        const response = await signUpRandomly();
        accessToken = response.data.accessToken;
      }
    );

    describe('Tests start after uploading new set list', (): void => {
      let setList;
      beforeEach(
        async (): Promise<void> => {
          setList = [
            new SetBuilder().build({
              setName: 'set 1',
              learningLanguageCode: 'en',
              translatedToLanguageCode: 'any',
              createdAt: moment('2018-01-01T04:00:00').toDate(),
              updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
              updatedAt: moment('2018-01-01T01:00:00').toDate(),
            }),
            new SetBuilder().build({
              setName: 'set 2 ',
              learningLanguageCode: 'es',
              translatedToLanguageCode: 'en',
              setStatus: SetStatus.ARCHIVED,
              createdAt: moment('2018-01-01T04:00:00').toDate(),
              updatedStatusAt: moment('2018-01-01T02:00:00').toDate(),
              updatedAt: moment('2018-01-01T01:00:00').toDate(),
              extraData: [
                {
                  dataName: SetExtraDataName.SPACED_REPETITION_AUTO_ARCHIVE,
                  dataValue: false,
                  createdAt: moment('2018-01-01T06:00:00').toDate(),
                  updatedAt: moment('2018-01-01T05:00:00').toDate(),
                },
              ],
            }),
          ];
          await Axios.post(
            env.API_URL + '/upload-sets',
            {
              setList,
            },
            { headers: { Authorization: 'Bearer ' + accessToken } }
          );
        }
      );

      it('should download specific sets successfully with access token', async (): Promise<
        void
      > => {
        const response = await Axios.post(
          env.API_URL + '/download-specific-sets',
          {
            setIds: setList.map((set): string => set.setId),
          },
          { headers: { Authorization: 'Bearer ' + accessToken } }
        );

        const {
          setList: downloadedSetList,
        } = new DownloadSpecificSetsResponseResolver().resolve(
          response.data,
          true
        );

        expect(downloadedSetList).toIncludeSameMembers(
          setList.map(
            (set): Set => {
              return {
                ...set,
                firstSyncedAt: expect.toBeDate(),
                lastSyncedAt: expect.toBeDate(),
                extraData: set.extraData.map(
                  (extraData): SetExtraDataItem => {
                    return {
                      ...extraData,
                      firstSyncedAt: expect.toBeDate(),
                      lastSyncedAt: expect.toBeDate(),
                    };
                  }
                ),
              };
            }
          )
        );
      });
    });
  });
});
