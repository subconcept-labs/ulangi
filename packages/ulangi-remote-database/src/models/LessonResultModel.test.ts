/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LessonResultBuilder } from '@ulangi/ulangi-common/builders';
import { LessonResult } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as knex from 'knex';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { LessonResultModel } from '../models/LessonResultModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('LessonResultModel', (): void => {
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
    let lessonResultModel: LessonResultModel;

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
        lessonResultModel = modelFactory.createModel('lessonResultModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    test('insert lesson results successfully', async (): Promise<void> => {
      const lessonResults = Array(4)
        .fill(null)
        .map(
          (_, index): LessonResult => {
            return new LessonResultBuilder().build({
              totalCount: index,
              createdAt: moment()
                .add(index, 'days')
                .toDate(),
            });
          }
        );

      await shardDb.transaction(
        async (tx): Promise<void> => {
          return lessonResultModel.insertOrIgnoreLessonResults(
            tx,
            userId,
            lessonResults
          );
        }
      );
    });

    test('get heat map data', async (): Promise<void> => {
      const lessonResults = Array(4)
        .fill(null)
        .map(
          (_, index): LessonResult => {
            return new LessonResultBuilder().build({
              totalCount: index,
              createdAt: moment()
                .add(index, 'days')
                .toDate(),
            });
          }
        );

      await shardDb.transaction(
        async (tx): Promise<void> => {
          return lessonResultModel.insertOrIgnoreLessonResults(
            tx,
            userId,
            lessonResults
          );
        }
      );

      const data = await lessonResultModel.getHeapMapData(shardDb, userId, [
        moment().toDate(),
        moment()
          .add(9, 'days')
          .toDate(),
      ]);

      expect(data).toEqual([0, 1, 2, 3, 0, 0, 0, 0, 0, 0]);
    });
  });
});
