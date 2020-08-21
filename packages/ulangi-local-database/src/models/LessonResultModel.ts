import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { LessonResult } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { LessonResultRowConverter } from '../converters/LessonResultRowConverter';
import { DatabaseEvent } from '../enums/DatabaseEvent';
import { TableName } from '../enums/TableName';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { LessonResultRowPreparer } from '../preparers/LessonResultRowPreparer';
import { LessonResultRowResolver } from '../resolvers/LessonResultRowResolver';

export class LessonResultModel {
  private lessonResultRowResolver = new LessonResultRowResolver();
  private lessonResultRowPreparer = new LessonResultRowPreparer();
  private lessonResultRowConverter = new LessonResultRowConverter();
  private databaseEventBus: DatabaseEventBus;

  public constructor(databaseEventBus: DatabaseEventBus) {
    this.databaseEventBus = databaseEventBus;
  }

  public getLessonResults(
    db: SQLiteDatabase,
    limit: number,
    stripUnknown: boolean
  ): Promise<LessonResult[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.LESSON_RESULT)
            .limit(limit)
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const lessonResultRows = this.lessonResultRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const lessonResults = lessonResultRows.map(
            (lessonResultRow): LessonResult => {
              return this.lessonResultRowConverter.convertToLessonResult(
                lessonResultRow
              );
            }
          );

          resolve(lessonResults);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public insertLessonResult(
    tx: Transaction,
    lessonResult: LessonResult,
    options?: { doNotPublishEvent?: boolean }
  ): void {
    const lessonResultRow = this.lessonResultRowPreparer.prepareInsert(
      lessonResult
    );

    const query = squel
      .insert()
      .into(TableName.LESSON_RESULT)
      .setFields(lessonResultRow)
      .toParam();

    tx.executeSql(query.text, query.values);

    if (_.get(options, 'doNotPublishEvent') !== true) {
      tx.onCommitted(
        (): void => {
          this.databaseEventBus.publish(DatabaseEvent.LESSON_RESULT_INSERTED);
        }
      );
    }
  }

  public deleteLessonResults(
    tx: Transaction,
    lessonResultIds: readonly string[]
  ): void {
    const query = squel
      .delete()
      .from(TableName.LESSON_RESULT)
      .where('lessonResultId IN ?', lessonResultIds)
      .toParam();

    tx.executeSql(query.text, query.values);
  }
}
