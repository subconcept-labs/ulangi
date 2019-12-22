/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  DownloadSetsRequest,
  DownloadSetsResponse,
} from '@ulangi/ulangi-common/interfaces';
import { DownloadSetsRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, SetModel } from '@ulangi/ulangi-remote-database';
import * as _ from 'lodash';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class DownloadSetsController extends ApiController<
  DownloadSetsRequest,
  DownloadSetsResponse
> {
  private database: DatabaseFacade;
  private setModel: SetModel;

  public constructor(database: DatabaseFacade, setModel: SetModel) {
    super();
    this.database = database;
    this.setModel = setModel;
  }

  public options(): ControllerOptions<DownloadSetsRequest> {
    return {
      paths: ['/download-sets'],
      allowedMethod: 'get',
      authStrategies: [
        AuthenticationStrategy.ACCESS_TOKEN,
        AuthenticationStrategy.SYNC_API_KEY,
      ],
      requestResolver: new DownloadSetsRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<DownloadSetsRequest>,
    res: ApiResponse<DownloadSetsResponse>
  ): Promise<void> {
    const { startAt, softLimit } = req.query;

    const userId = req.user.userId;
    const shardId = req.userShardId;
    const userDb = this.database.getDb(shardId);

    const { setList, noMore } = await this.setModel.getSetsByLastSyncTime(
      userDb,
      userId,
      softLimit,
      startAt,
      true
    );

    if (noMore === false && setList.length > 0) {
      // Since sets with max lastSyncedAt will be downloaded again in
      // the next download request, we need to send only one set with max
      // lastSyncedAt to reduce bandwidth and local inserts.
      const maxSet = assertExists(_.maxBy(setList, 'lastSyncedAt'));
      const prunedSetList = setList
        .filter(
          (set): boolean =>
            assertExists(set.lastSyncedAt) < assertExists(maxSet.lastSyncedAt)
        )
        .concat([maxSet]);

      res.json({
        setList: prunedSetList,
        noMore,
      });
    } else {
      res.json({
        setList,
        noMore,
      });
    }
  }
}
