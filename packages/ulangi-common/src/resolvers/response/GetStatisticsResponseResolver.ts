/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';

import { GetStatisticsResponse } from '../../interfaces/response/GetStatisticsResponse';
import { StatisticsResolver } from '../general/StatisticsResolver';

export class GetStatisticsResponseResolver extends AbstractResolver<
  GetStatisticsResponse
> {
  private statisticsResolver = new StatisticsResolver();

  protected rules = {
    statistics: this.statisticsResolver.getRules(),
  };
}
