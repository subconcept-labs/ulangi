/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  DownloadSpecificSetsRequest,
  DownloadSpecificSetsResponse,
} from '@ulangi/ulangi-common/interfaces';
import { DownloadSpecificSetsRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, SetModel } from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class DownloadSpecificSetsController extends ApiController<
  DownloadSpecificSetsRequest,
  DownloadSpecificSetsResponse
> {
  private database: DatabaseFacade;
  private setModel: SetModel;

  public constructor(database: DatabaseFacade, setModel: SetModel) {
    super();
    this.database = database;
    this.setModel = setModel;
  }

  public options(): ControllerOptions<DownloadSpecificSetsRequest> {
    return {
      paths: ['/download-specific-sets'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new DownloadSpecificSetsRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<DownloadSpecificSetsRequest>,
    res: ApiResponse<DownloadSpecificSetsResponse>
  ): Promise<void> {
    const { setIds } = req.body;

    const userId = req.user.userId;
    const shardId = req.userShardId;
    const userDb = this.database.getDb(shardId);

    const { setList } = await this.setModel.getSetsByIds(
      userDb,
      userId,
      setIds,
      true
    );

    res.json({ setList });
  }
}
