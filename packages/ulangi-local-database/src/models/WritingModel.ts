/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { WritingScheduler } from '@ulangi/ulangi-common/core';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Category, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { CategoryResolver } from '@ulangi/ulangi-common/resolvers';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';
import { VocabularyRowResolver } from '../resolvers/VocabularyRowResolver';
import { addCategoryConditions } from '../utils/addCategoryConditions';
import { addLevelCountAggregation } from '../utils/addLevelCountAggregation';
import { VocabularyModel } from './VocabularyModel';

export class WritingModel {
  private writingScheduler = new WritingScheduler();
  private vocabularyRowResolver = new VocabularyRowResolver();
  private categoryResolver = new CategoryResolver();

  private vocabularyModel: VocabularyModel;

  public constructor(vocabularyModel: VocabularyModel) {
    this.vocabularyModel = vocabularyModel;
  }

  public getDueVocabularyListByLevel(
    db: SQLiteDatabase,
    setId: string,
    level: number,
    initialInterval: number,
    limit: number,
    stripUnknown: boolean,
    selectedCategoryNames: undefined | string[],
    excludedCategoryNames: undefined | string[]
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let buildingQuery = squel
            .select()
            .field('v.*')
            .from(TableName.VOCABULARY, 'v')
            .left_join(
              TableName.VOCABULARY_WRITING,
              'w',
              'v.vocabularyId = w.vocabularyId'
            );

          if (
            typeof selectedCategoryNames !== 'undefined' ||
            typeof excludedCategoryNames !== 'undefined'
          ) {
            buildingQuery = addCategoryConditions(
              buildingQuery,
              selectedCategoryNames,
              excludedCategoryNames
            );
          }

          if (level === 0) {
            buildingQuery = buildingQuery.where(
              'w.vocabularyId IS NULL OR (w.disabled = ? AND w.level = ?)',
              0,
              0
            );
          } else {
            // The number of hours that user has to wait for this level. Note that the number is doubled on each level
            const hours = this.writingScheduler.calculateWaitingHours(
              initialInterval,
              level
            );
            buildingQuery = buildingQuery
              .where(
                'w.lastWrittenAt IS NULL OR w.lastWrittenAt < ?',
                moment
                  .utc()
                  .subtract(hours, 'hours')
                  .unix()
              )
              .where('w.disabled = ?', 0)
              .where('w.level = ?', level);
          }

          const query = buildingQuery
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE)
            .limit(limit)
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const vocabularyRows = this.vocabularyRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const vocabularyList = await this.vocabularyModel.getCompleteVocabularyListByRows(
            db,
            vocabularyRows,
            stripUnknown
          );

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getDueVocabularyList(
    db: SQLiteDatabase,
    setId: string,
    initialInterval: number,
    maxLevel: number,
    categoryNames: undefined | string[],
    limit: number,
    offset: number,
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field('v.*')
            .from(TableName.VOCABULARY, 'v')
            .left_join(
              TableName.VOCABULARY_WRITING,
              'w',
              'v.vocabularyId = w.vocabularyId'
            );

          if (typeof categoryNames !== 'undefined') {
            query = query.left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            );
            if (_.includes(categoryNames, 'Uncategorized')) {
              query = query.where(
                'c.categoryName IN ? OR c.categoryName IS NULL',
                categoryNames
              );
            } else {
              query = query.where('c.categoryName IN ?', categoryNames);
            }
          }

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE);

          query = this.addDueCondition(query, initialInterval, maxLevel);

          const queryParam = query
            .order('v.updatedStatusAt', false)
            .limit(limit)
            .offset(offset)
            .toParam();

          const result = await db.executeSql(
            queryParam.text,
            queryParam.values
          );

          const vocabularyRows = this.vocabularyRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const vocabularyList = await this.vocabularyModel.getCompleteVocabularyListByRows(
            db,
            vocabularyRows,
            stripUnknown
          );

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getDueCategoryList(
    db: SQLiteDatabase,
    setId: string,
    initialInterval: number,
    maxLevel: number,
    limitOfCategorized: number,
    offsetOfCategorized: number,
    includeUncategorized: boolean
  ): Promise<{
    categoryList: readonly Category[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let uncategorized;
          if (includeUncategorized) {
            uncategorized = await this.getUncategorizedDueCounts(
              db,
              setId,
              initialInterval,
              maxLevel
            );
          }

          let query = squel
            .select()
            .field('categoryName')
            .field('COUNT(c.vocabularyId)', 'totalCount');

          query = addLevelCountAggregation(query);

          query = query
            .from(TableName.VOCABULARY_CATEGORY, 'c')
            .left_join(
              TableName.VOCABULARY,
              'v',
              'v.vocabularyId = c.vocabularyId'
            )
            .left_join(
              TableName.VOCABULARY_WRITING,
              'w',
              'v.vocabularyId = w.vocabularyId'
            )
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE);

          query = this.addDueCondition(query, initialInterval, maxLevel);

          query = query
            .group('categoryName')
            .having('totalCount > 0 and categoryName != ?', 'Uncategorized')
            .order('categoryName', true)
            .limit(limitOfCategorized)
            .offset(offsetOfCategorized);

          const sql = query.toParam();

          const result = await db.executeSql(sql.text, sql.values);

          let categoryList = this.categoryResolver.resolveArray(
            result.rows.slice(),
            true
          );

          if (
            typeof uncategorized !== 'undefined' &&
            uncategorized.totalCount
          ) {
            categoryList = [uncategorized, ...categoryList];
          }

          resolve({ categoryList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getUncategorizedDueCounts(
    db: SQLiteDatabase,
    setId: string,
    initialInterval: number,
    maxLevel: number
  ): Promise<Category> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field('COUNT(v.vocabularyId)', 'totalCount');

          query = addLevelCountAggregation(query);

          query = query
            .from(TableName.VOCABULARY, 'v')
            .left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            )
            .left_join(
              TableName.VOCABULARY_WRITING,
              'w',
              'v.vocabularyId = w.vocabularyId'
            )
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE);

          query = this.addDueCondition(query, initialInterval, maxLevel);

          query = query.where(
            "c.categoryName IS NULL OR c.categoryName = 'Uncategorized'"
          );

          const sql = query.toParam();

          const result = await db.executeSql(sql.text, sql.values);

          const category = this.categoryResolver.resolve(
            {
              ...result.rows[0],
              categoryName: 'Uncategorized',
            },
            true
          );

          resolve(category);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private addDueCondition(
    query: squel.Select,
    initialInterval: number,
    maxLevel: number
  ): squel.Select {
    return query.where(
      'w.disabled IS NULL OR (w.disabled = 0 AND (w.lastWrittenAt IS NULL OR w.lastWrittenAt < ?))',
      _.range(maxLevel).reduce((reviewTimeByLevel, level): squel.Case => {
        return reviewTimeByLevel.when(level.toString()).then(
          moment()
            .subtract(
              this.writingScheduler.calculateWaitingHours(
                initialInterval,
                level
              ),
              'hours'
            )
            .unix()
        );
      }, squel.case('w.level'))
    );
  }
}
