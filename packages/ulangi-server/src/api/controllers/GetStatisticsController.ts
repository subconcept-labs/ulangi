/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  GetStatisticsRequest,
  GetStatisticsResponse,
} from '@ulangi/ulangi-common/interfaces';
import { GetStatisticsRequestResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  LessonResultModel,
} from '@ulangi/ulangi-remote-database';
import * as _ from 'lodash';
import * as moment from 'moment';

import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class GetStatisticsController extends ApiController<
  GetStatisticsRequest,
  GetStatisticsResponse
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

  public options(): ControllerOptions<GetStatisticsRequest> {
    return {
      paths: ['/get-statistics'],
      allowedMethod: 'get',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new GetStatisticsRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<GetStatisticsRequest>,
    res: ApiResponse<GetStatisticsResponse>
  ): Promise<void> {
    const userId = req.user.userId;

    const { currentLocalTime } = req.query;

    const shardDb = this.database.getDb(req.userShardId);

    const dateCountsPairs = await this.lessonResultModel.getTotalCountsPerDay(
      shardDb,
      userId,
      currentLocalTime
    );

    const totalReviews = _.sumBy(dateCountsPairs, ([, count]): number => count);

    const averageReviewsPerDay =
      dateCountsPairs.length > 0 ? totalReviews / dateCountsPairs.length : 0;

    const streaks: number[] = [];
    let i = 0;
    while (i < dateCountsPairs.length) {
      const [currDate, count] = dateCountsPairs[i];

      if (i === 0) {
        streaks.push(1);
      } else {
        const [prevDate] = dateCountsPairs[i - 1];
        if (count > 0 && moment(currDate).diff(prevDate, 'days') <= 1) {
          streaks[streaks.length - 1] += 1;
        } else {
          streaks.push(1);
        }
      }

      i++;
    }

    const latestStreak = streaks[streaks.length - 1] || 0;

    const longestStreak = _.max(streaks) || 0;

    res.json({
      statistics: {
        totalReviews,
        averageReviewsPerDay,
        latestStreak,
        longestStreak,
      },
    });
  }
}
