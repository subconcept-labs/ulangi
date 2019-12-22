/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  SetBuilder,
  SetExtraDataItemBuilder,
} from '@ulangi/ulangi-common/builders';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as knex from 'knex';
import * as _ from 'lodash';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { SetExtraDataModel } from '../models/SetExtraDataModel';
import { SetModel } from '../models/SetModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('SetExtraDataModel', (): void => {
  const env = resolveEnv();

  let userId: string;
  let restoreCurrentTime: () => void;

  beforeEach(
    async (): Promise<void> => {
      userId = short.generate();
      restoreCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let shardDb: knex;
    let setExtraDataModel: SetExtraDataModel;
    let setModel: SetModel;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(
          env.AUTH_DATABASE_CONFIG,
          env.ALL_SHARD_DATABASE_CONFIG,
          env.SHARD_DATABASE_NAME_PREFIX
        );
        shardDb = databaseFacade.getDb(
          env.ALL_SHARD_DATABASE_CONFIG[0].shardId
        );
        setExtraDataModel = new SetExtraDataModel();
        setModel = new SetModel(setExtraDataModel);
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    test('upsert extra data failed due to foreign contraints', async (): Promise<
      void
    > => {
      await shardDb.transaction(
        async (tx): Promise<void> => {
          return setExtraDataModel.upsertMultipleExtraData(tx, userId, [
            [
              new SetExtraDataItemBuilder().build({
                dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
                dataValue: 5,
              }),
              'setId',
            ],
          ]);
        }
      );

      const {
        setExtraDataPerSetId: fetchedSetExtraDataPerSetId,
      } = await setExtraDataModel.getExtraDataBySetIds(
        shardDb,
        userId,
        ['setId'],
        true
      );

      expect(fetchedSetExtraDataPerSetId).toEqual({});
    });

    describe('Tests start after insert some sets into database', (): void => {
      let setList: readonly Set[];
      beforeEach(
        async (): Promise<void> => {
          setList = Array(4)
            .fill(null)
            .map(
              (_, index): Set => {
                return new SetBuilder().build({
                  setName: 'set' + index,
                  learningLanguageCode: 'en',
                  translatedToLanguageCode: 'en',
                });
              }
            );

          await shardDb.transaction(
            async (tx): Promise<void[]> => {
              return Promise.all([setModel.upsertSets(tx, userId, setList)]);
            }
          );
        }
      );

      test('upsert new extra data successfully', async (): Promise<void> => {
        const setExtraDataSetIdPairs = setList.map(
          (set): [SetExtraDataItem, string] => [
            new SetExtraDataItemBuilder().build({
              dataName: SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
              dataValue: 5,
            }),
            set.setId,
          ]
        );

        await shardDb.transaction(
          async (tx): Promise<void> => {
            return setExtraDataModel.upsertMultipleExtraData(
              tx,
              userId,
              setExtraDataSetIdPairs
            );
          }
        );

        const {
          setExtraDataPerSetId,
        } = await setExtraDataModel.getExtraDataBySetIds(
          shardDb,
          userId,
          setList.map((set): string => set.setId),
          true
        );

        _.forOwn(
          setExtraDataPerSetId,
          (setExtraData, setId): void => {
            expect(setExtraData).toIncludeSameMembers(
              setExtraDataSetIdPairs
                .filter((pair): boolean => pair[1] === setId)
                .map(
                  ([extraDataItem]): SetExtraDataItem => {
                    return {
                      ...extraDataItem,
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
                    };
                  }
                )
            );
          }
        );
      });

      describe('Tests start after upserting some set extra data into database', (): void => {
        let setExtraDataSetIdPairs: readonly [SetExtraDataItem, string][];

        let restoreCurrentTime: () => void;

        beforeEach(
          async (): Promise<void> => {
            restoreCurrentTime = mockCurrentTime();

            setExtraDataSetIdPairs = setList.map(
              (set, index): [SetExtraDataItem, string] => [
                new SetExtraDataItemBuilder().build({
                  dataName: SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                  dataValue: index,
                }),
                set.setId,
              ]
            );

            await shardDb.transaction(
              async (tx): Promise<void> => {
                return setExtraDataModel.upsertMultipleExtraData(
                  tx,
                  userId,
                  setExtraDataSetIdPairs
                );
              }
            );
          }
        );

        afterEach(
          (): void => {
            restoreCurrentTime();
          }
        );

        test('get extra data by set ids', async (): Promise<void> => {
          const {
            setExtraDataPerSetId,
          } = await setExtraDataModel.getExtraDataBySetIds(
            shardDb,
            userId,
            setList.map((set): string => set.setId),
            true
          );

          _.forOwn(
            setExtraDataPerSetId,
            (setExtraData, setId): void => {
              expect(setExtraData).toIncludeSameMembers(
                setExtraDataSetIdPairs
                  .filter((pair): boolean => pair[1] === setId)
                  .map(
                    ([setExtraDataItem]): SetExtraDataItem => {
                      return {
                        ...setExtraDataItem,
                        firstSyncedAt: expect.any(Date),
                        lastSyncedAt: expect.any(Date),
                      };
                    }
                  )
              );
            }
          );
        });

        test('upsert existing extra data', async (): Promise<void> => {
          const newSetExtraDataSetIdPairs = setExtraDataSetIdPairs.map(
            ([, setId]): [SetExtraDataItem, string] => {
              return [
                new SetExtraDataItemBuilder().build({
                  dataName: SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                  dataValue: 5,
                }),
                setId,
              ];
            }
          );

          await shardDb.transaction(
            async (tx): Promise<void> => {
              return setExtraDataModel.upsertMultipleExtraData(
                tx,
                userId,
                newSetExtraDataSetIdPairs
              );
            }
          );

          const {
            setExtraDataPerSetId,
          } = await setExtraDataModel.getExtraDataBySetIds(
            shardDb,
            userId,
            setList.map((set): string => set.setId),
            true
          );

          _.forOwn(
            setExtraDataPerSetId,
            (setExtraData, setId): void => {
              expect(setExtraData).toIncludeSameMembers(
                setExtraDataSetIdPairs
                  .filter((pair): boolean => pair[1] === setId)
                  .map(
                    ([setExtraDataItem]): SetExtraDataItem => {
                      return {
                        ...setExtraDataItem,
                        dataName:
                          SetExtraDataName.SPACED_REPETITION_LEVEL_THRESHOLD,
                        dataValue: 5,
                        firstSyncedAt: expect.any(Date),
                        lastSyncedAt: expect.any(Date),
                      };
                    }
                  )
              );
            }
          );
        });
      });
    });
  });
});
