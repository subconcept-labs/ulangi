/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LessonResult } from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';
import * as moment from 'moment';

import { TableName } from '../enums/TableName';
import { LessonResultRowForInsert } from '../interfaces/LessonResultRow';
import { LessonResultRowPreparer } from '../preparers/LessonResultRowPreparer';
import { promisifyQuery } from '../utils/promisifyQuery';

export class LessonResultModel {
  private lessonResultRowPreparer = new LessonResultRowPreparer();

  public insertOrIgnoreLessonResults(
    db: knex.Transaction,
    userId: string,
    lessonResults: LessonResult[]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const lessonResultRows = lessonResults.map(
            (lessonResult): LessonResultRowForInsert => {
              return this.lessonResultRowPreparer.prepareInsert(
                userId,
                lessonResult
              );
            }
          );

          const { sql, bindings } = db
            .insert(lessonResultRows)
            .into(TableName.LESSON_RESULT)
            .toSQL();

          await promisifyQuery(
            db.raw(sql.replace('insert', 'insert ignore'), bindings)
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getTotalCountsPerDay(
    db: knex,
    userId: string,
    beforeTime: Date
  ): Promise<[Date, number][]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result: { date: Date; count: number }[] = await promisifyQuery(
            db
              .select(
                db.raw('DATE(createdAt) as date, SUM(totalCount) as count')
              )
              .from(TableName.LESSON_RESULT)
              .where('userId', userId)
              .where('createdAt', '<', beforeTime)
              .groupByRaw('DATE(createdAt)')
              .orderByRaw('DATE(createdAt)')
          );

          resolve(
            result.map(
              (row): [Date, number] => {
                return [row.date, row.count];
              }
            )
          );
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getHeapMapData(
    db: knex,
    userId: string,
    range: [Date, Date]
  ): Promise<(number | null)[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result: { date: Date; count: number }[] = await promisifyQuery(
            db
              .select(
                db.raw('DATE(createdAt) as date, SUM(totalCount) as count')
              )
              .from(TableName.LESSON_RESULT)
              .where('userId', userId)
              .whereBetween('createdAt', range)
              .groupBy(db.raw('DATE(createdAt)'))
          );

          const dateCountMap = new Map(
            result.map(
              (row): [string, number] => {
                return [moment(row.date).format('L'), row.count];
              }
            )
          );

          const [start, end] = range;

          const days = _.range(0, moment(end).diff(moment(start), 'days') + 1);

          const data = days.map(
            (day): number => {
              return (
                dateCountMap.get(
                  moment(start)
                    .add(day, 'days')
                    .format('L')
                ) || 0
              );
            }
          );

          resolve(data);
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
