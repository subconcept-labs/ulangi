/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  UploadSetsRequest,
  UploadSetsResponse,
} from '@ulangi/ulangi-common/interfaces';
import { UploadSetsRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, SetModel } from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { FirebaseFacade } from '../../facades/FirebaseFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class UploadSetsController extends ApiController<
  UploadSetsRequest,
  UploadSetsResponse
> {
  private database: DatabaseFacade;
  private firebase: FirebaseFacade;
  private setModel: SetModel;

  public constructor(
    database: DatabaseFacade,
    firebase: FirebaseFacade,
    setModel: SetModel
  ) {
    super();
    this.database = database;
    this.firebase = firebase;
    this.setModel = setModel;
  }

  public options(): ControllerOptions<UploadSetsRequest> {
    return {
      paths: ['/upload-sets'],
      allowedMethod: 'post',
      authStrategies: [
        AuthenticationStrategy.ACCESS_TOKEN,
        AuthenticationStrategy.SYNC_API_KEY,
      ],
      requestResolver: new UploadSetsRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<UploadSetsRequest>,
    res: ApiResponse<UploadSetsResponse>
  ): Promise<void> {
    const { setList } = req.body;

    const userId = req.user.userId;

    const shardDb = this.database.getDb(req.userShardId);

    await shardDb.transaction(
      (tx): Promise<void> => {
        return this.setModel.upsertSets(tx, userId, setList);
      }
    );

    res.json({
      acknowledged: setList.map((set): string => assertExists(set.setId)),
    });

    await this.firebase.notifySetChange(shardDb, userId);
  }
}
