/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  GetHeatMapDataRequest,
  GetHeatMapDataResponse,
} from '@ulangi/ulangi-common/interfaces';
import { GetHeatMapDataRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  LessonResultModel,
} from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class GetHeatMapDataController extends ApiController<
  GetHeatMapDataRequest,
  GetHeatMapDataResponse
> {
  private database: DatabaseFacade;
  private lessonResultModel: LessonResultModel;

  public constructor(
    database: DatabaseFacade,
    lessonResultModel: LessonResultModel
  ) {
    super();
    this.database = database;
    this.lessonResultModel = lessonResultModel;
  }

  public options(): ControllerOptions<GetHeatMapDataRequest> {
    return {
      paths: ['/get-heat-map-data'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new GetHeatMapDataRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<GetHeatMapDataRequest>,
    res: ApiResponse<GetHeatMapDataResponse>
  ): Promise<void> {
    const { startDate, endDate } = req.query;

    const userId = req.user.userId;

    const shardDb = this.database.getDb(req.userShardId);

    const data = await this.lessonResultModel.getHeapMapData(shardDb, userId, [
      startDate,
      endDate,
    ]);

    res.json({ data });
  }
}
