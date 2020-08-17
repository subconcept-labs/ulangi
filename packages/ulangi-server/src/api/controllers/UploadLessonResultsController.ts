/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  UploadLessonResultsRequest,
  UploadLessonResultsResponse,
} from '@ulangi/ulangi-common/interfaces';
import { UploadLessonResultsRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  LessonResultModel,
} from '@ulangi/ulangi-remote-database';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class UploadLessonResultsController extends ApiController<
  UploadLessonResultsRequest,
  UploadLessonResultsResponse
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

  public options(): ControllerOptions<UploadLessonResultsRequest> {
    return {
      paths: ['/upload-lesson-results'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new UploadLessonResultsRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<UploadLessonResultsRequest>,
    res: ApiResponse<UploadLessonResultsResponse>
  ): Promise<void> {
    const userId = req.user.userId;

    const shardDb = this.database.getDb(req.userShardId);

    const lessonResults = req.body.lessonResults;

    await shardDb.transaction(
      (tx): Promise<void> => {
        return this.lessonResultModel.insertOrIgnoreLessonResults(
          tx,
          userId,
          lessonResults.slice()
        );
      }
    );

    res.json({
      acknowledged: lessonResults.map(
        (result): string => result.lessonResultId
      ),
    });
  }
}
