/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import {
  SetBuilder,
  SetExtraDataItemBuilder,
} from '@ulangi/ulangi-common/builders';
import { SetExtraDataName, SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as knex from 'knex';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { SetModel } from '../models/SetModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('SetModel', (): void => {
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
    let modelFactory: ModelFactory;
    let setModel: SetModel;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(
          env.AUTH_DATABASE_CONFIG,
          env.ALL_SHARD_DATABASE_CONFIG,
          env.SHARD_DATABASE_NAME_PREFIX
        );

        await databaseFacade.checkAllShardDatabaseTables();
        shardDb = databaseFacade.getDb(
          env.ALL_SHARD_DATABASE_CONFIG[0].shardId
        );

        modelFactory = new ModelFactory();
        setModel = modelFactory.createModel('setModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    test('insert sets successfully', async (): Promise<void> => {
      const setList = Array(4)
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

      const { setList: fetchedSetList } = await setModel.getSetsByIds(
        shardDb,
        userId,
        setList.map((set): string => set.setId),
        true
      );

      expect(fetchedSetList).toIncludeSameMembers(
        setList.map(
          (set): Set => {
            return {
              ...set,
              firstSyncedAt: expect.any(Date),
              lastSyncedAt: expect.any(Date),
            };
          }
        )
      );
    });

    describe('Tests start after inserting sets with extra data into database', (): void => {
      let setList: readonly Set[];
      let restoreCurrentTime: () => void;
      beforeEach(
        async (): Promise<void> => {
          restoreCurrentTime = mockCurrentTime();
          setList = Array(4)
            .fill(null)
            .map(
              (): Set => {
                return new SetBuilder().build({
                  setName: 'set',
                  learningLanguageCode: 'en',
                  translatedToLanguageCode: 'en',
                  extraData: [
                    new SetExtraDataItemBuilder().build({
                      dataName: SetExtraDataName.SPACED_REPETITION_AUTO_ARCHIVE,
                      dataValue: true,
                    }),
                  ],
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

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('get set list by lastest sync time', async (): Promise<void> => {
        const {
          setList: fetchedSetList,
        } = await setModel.getSetsByLastSyncTime(
          shardDb,
          userId,
          10,
          undefined,
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(
          setList.map(
            (set): Set => {
              return {
                ...set,
                extraData: expect.toIncludeSameMembers(
                  set.extraData.map(
                    (extraData): SetExtraDataItem => {
                      return {
                        ...extraData,
                        firstSyncedAt: expect.any(Date),
                        lastSyncedAt: expect.any(Date),
                      };
                    }
                  )
                ),
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          )
        );
      });

      test('get set by ids', async (): Promise<void> => {
        const { setList: fetchedSetList } = await setModel.getSetsByIds(
          shardDb,
          userId,
          setList.map((set): string => set.setId),
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(
          setList.map(
            (set): Set => {
              return {
                ...set,
                extraData: expect.toIncludeSameMembers(
                  set.extraData.map(
                    (extraData): SetExtraDataItem => {
                      return {
                        ...extraData,
                        firstSyncedAt: expect.any(Date),
                        lastSyncedAt: expect.any(Date),
                      };
                    }
                  )
                ),
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          )
        );
      });

      test('get existing set ids', async (): Promise<void> => {
        const { existingSetIds } = await setModel.getExistingSetIds(
          shardDb,
          userId,
          setList.map((set): string => set.setId)
        );

        expect(existingSetIds).toIncludeSameMembers(
          setList.map((set): string => set.setId)
        );
      });

      test('get lastest sync time', async (): Promise<void> => {
        const {
          setList: fetchedSetList,
        } = await setModel.getSetsByLastSyncTime(
          shardDb,
          userId,
          20,
          undefined,
          true
        );

        const expectedLatestSyncedTime = _.get(
          _.maxBy(fetchedSetList, 'lastSyncedAt'),
          'lastSyncedAt'
        );

        const actualLatestSyncedTime = await setModel.getLatestSyncTime(
          shardDb,
          userId
        );

        expect(actualLatestSyncedTime).toEqual(expectedLatestSyncedTime);
      });

      test('upsert new sets', async (): Promise<void> => {
        const newSetList = Array(4)
          .fill(null)
          .map(
            (): Set => {
              return new SetBuilder().build({
                setName: 'new set name',
                setStatus: SetStatus.ACTIVE,
                learningLanguageCode: 'vi',
                translatedToLanguageCode: 'zh',
                extraData: [
                  new SetExtraDataItemBuilder().build({
                    dataName: SetExtraDataName.SPACED_REPETITION_AUTO_ARCHIVE,
                    dataValue: true,
                  }),
                ],
              });
            }
          );

        await shardDb.transaction(
          async (tx): Promise<void> => {
            return setModel.upsertSets(tx, userId, newSetList);
          }
        );

        const { setList: fetchedSetList } = await setModel.getSetsByIds(
          shardDb,
          userId,
          newSetList.map((set): string => set.setId),
          true
        );

        expect(fetchedSetList).toIncludeSameMembers(
          newSetList.map(
            (set): Set => {
              return {
                ...set,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
                extraData: set.extraData.map(
                  (extraDataItem): SetExtraDataItem => {
                    return {
                      ...extraDataItem,
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
                    };
                  }
                ),
              };
            }
          )
        );
      });

      test('upsert existing sets', async (): Promise<void> => {
        const editedSetList = setList.map(
          (set): DeepPartial<Set> => {
            return {
              ...set,
              setName: 'edited ' + set.setName,
              setStatus: SetStatus.ARCHIVED,
              learningLanguageCode: 'vi',
              translatedToLanguageCode: 'zh',
              extraData: [
                {
                  createdAt: moment().toDate(),
                  updatedAt: moment().toDate(),
                  dataName: SetExtraDataName.SPACED_REPETITION_AUTO_ARCHIVE,
                  dataValue: false,
                },
              ],
            };
          }
        );

        await shardDb.transaction(
          async (tx): Promise<void> => {
            return setModel.upsertSets(tx, userId, editedSetList);
          }
        );

        const { setList: fetchedSetList } = await setModel.getSetsByIds(
          shardDb,
          userId,
          setList.map((set): string => set.setId),
          true
        );
        expect(fetchedSetList).toIncludeSameMembers(
          setList.map(
            (set): Set => {
              return {
                ...set,
                setName: 'edited ' + set.setName,
                setStatus: SetStatus.ARCHIVED,
                learningLanguageCode: 'vi',
                translatedToLanguageCode: 'zh',
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
                extraData: set.extraData.map(
                  (): SetExtraDataItem => {
                    return {
                      dataName: SetExtraDataName.SPACED_REPETITION_AUTO_ARCHIVE,
                      dataValue: false,
                      createdAt: moment().toDate(),
                      updatedAt: moment().toDate(),
                      firstSyncedAt: expect.any(Date),
                      lastSyncedAt: expect.any(Date),
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
