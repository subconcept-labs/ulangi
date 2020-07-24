/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { SpacedRepetitionScheduler } from '@ulangi/ulangi-common/core';
import {
  CategorySortType,
  VocabularySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Category, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { CategoryResolver } from '@ulangi/ulangi-common/resolvers';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';
import { VocabularyRow } from '../interfaces/VocabularyRow';
import { VocabularyRowResolver } from '../resolvers/VocabularyRowResolver';
import { addCategoryConditions } from '../utils/addCategoryConditions';
import { addLevelCountAggregation } from '../utils/addLevelCountAggregation';
import { VocabularyModel } from './VocabularyModel';

export class SpacedRepetitionModel {
  private spacedRepetitionScheduler = new SpacedRepetitionScheduler();
  private vocabularyRowResolver = new VocabularyRowResolver();
  private categoryResolver = new CategoryResolver();

  private vocabularyModel: VocabularyModel;

  public constructor(vocabularyModel: VocabularyModel) {
    this.vocabularyModel = vocabularyModel;
  }

  /**
   * When level is 0, simply fetch by level
   * When level > 0, we have to compare lastLearnedAt with the waiting time of that level
   */
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
    vocabularyRows: readonly VocabularyRow[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let buildingQuery = squel
            .select()
            .field('v.*')
            .from(TableName.VOCABULARY, 'v');

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

          if (level > 0) {
            // The number of hours that user has to wait for this level. Note that the number is doubled on each level
            const hours = this.spacedRepetitionScheduler.calculateWaitingHours(
              initialInterval,
              level
            );
            buildingQuery = buildingQuery.where(
              'v.lastLearnedAt IS NULL OR v.lastLearnedAt < ?',
              moment
                .utc()
                .subtract(hours, 'hours')
                .unix()
            );
          }

          const query = buildingQuery
            .where('v.setId = ?', setId)
            .where('v.level = ?', level)
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

          resolve({ vocabularyList, vocabularyRows });
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
    sortType: VocabularySortType,
    limit: number,
    offset: number,
    stripUnknown: boolean
  ): Promise<{
    vocabularyList: readonly Vocabulary[];
    vocabularyRows: readonly VocabularyRow[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field('v.*')
            .from(TableName.VOCABULARY, 'v');

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

          if (sortType === VocabularySortType.SORT_BY_NAME_ASC) {
            query = query.order('v.vocabularyText', true);
          } else if (sortType === VocabularySortType.SORT_BY_NAME_DESC) {
            query = query.order('v.vocabularyText', false);
          }

          query = query.limit(limit).offset(offset);

          const queryParam = query.toParam();

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

          resolve({ vocabularyList, vocabularyRows });
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
    sortType: CategorySortType,
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
            .having('totalCount > 0 and categoryName != ?', 'Uncategorized');

          if (sortType === CategorySortType.SORT_BY_NAME_ASC) {
            query = query.order('categoryName', true);
          } else if (sortType === CategorySortType.SORT_BY_NAME_DESC) {
            query = query.order('categoryName', false);
          } else if (sortType === CategorySortType.SORT_BY_COUNT_ASC) {
            query = query.order('totalCount', true);
          } else if (sortType === CategorySortType.SORT_BY_COUNT_DESC) {
            query = query.order('totalCount', false);
          }

          query = query.limit(limitOfCategorized).offset(offsetOfCategorized);

          const queryParam = query.toParam();

          const result = await db.executeSql(
            queryParam.text,
            queryParam.values
          );

          let categoryList = this.categoryResolver.resolveArray(
            result.rows.slice(),
            true
          );

          if (
            typeof uncategorized !== 'undefined' &&
            uncategorized.totalCount > 0
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
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE)
            .where(
              "c.categoryName IS NULL OR c.categoryName = 'Uncategorized'"
            );

          query = this.addDueCondition(query, initialInterval, maxLevel);

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
      'v.lastLearnedAt IS NULL OR v.lastLearnedAt < ?',
      _.range(maxLevel).reduce((reviewTimeByLevel, level): squel.Case => {
        return reviewTimeByLevel.when(level.toString()).then(
          moment()
            .subtract(
              this.spacedRepetitionScheduler.calculateWaitingHours(
                initialInterval,
                level
              ),
              'hours'
            )
            .unix()
        );
      }, squel.case('v.level'))
    );
  }
}
