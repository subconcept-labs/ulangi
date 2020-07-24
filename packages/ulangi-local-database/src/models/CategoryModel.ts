/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import {
  CategorySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Category } from '@ulangi/ulangi-common/interfaces';
import { CategoryResolver } from '@ulangi/ulangi-common/resolvers';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';
import { addLevelCountAggregation } from '../utils/addLevelCountAggregation';

export class CategoryModel {
  private categoryResolver = new CategoryResolver();

  public getCategoryListByVocabularyStatus(
    db: SQLiteDatabase,
    setId: string,
    vocabularyStatus: VocabularyStatus,
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
            uncategorized = await this.getUncategorizedCounts(
              db,
              setId,
              vocabularyStatus
            );
          }

          let query = squel
            .select()
            .field('categoryName')
            .field('COUNT(v.vocabularyId)', 'totalCount');

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
            .where('v.vocabularyStatus = ?', vocabularyStatus)
            .group('categoryName')
            .having('categoryName != ?', 'Uncategorized');

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

          const sql = query.toParam();

          const result = await db.executeSql(sql.text, sql.values);

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

  public getUncategorizedCounts(
    db: SQLiteDatabase,
    setId: string,
    vocabularyStatus: VocabularyStatus
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
            .where('v.vocabularyStatus = ?', vocabularyStatus)
            .where(
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

  public hasUncategorizedVocabulary(
    db: SQLiteDatabase,
    setId: string,
    vocabularyStatus: VocabularyStatus
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY, 'v')
            .left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            )
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', vocabularyStatus)
            .where("c.categoryName IS NULL OR c.categoryName = 'Uncategorized'")
            .limit(1)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          if (result.rows.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public hasCategory(
    db: SQLiteDatabase,
    setId: string,
    vocabularyStatus: VocabularyStatus,
    categoryName: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY, 'v')
            .left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            )
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', vocabularyStatus)
            .where('c.categoryName = ?', categoryName)
            .limit(1)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          if (result.rows.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getCategoryNameSuggestions(
    db: SQLiteDatabase,
    setId: string,
    term: string,
    limit: number,
    offset: number
  ): Promise<{
    categoryNames: readonly string[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let buildingQuery = squel
            .select()
            .field('c.categoryName')
            .from(TableName.VOCABULARY, 'v')
            .left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            )
            .where('v.setId = ?', setId)
            .group('c.categoryName');

          // If term is empty then fetch all of them
          if (term !== '') {
            buildingQuery = buildingQuery.having(
              'c.categoryName LIKE ?',
              term + '%'
            );
          }

          const query = buildingQuery
            .order('c.categoryName', true)
            .limit(limit)
            .offset(offset)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          resolve({
            categoryNames: result.rows.map(
              ({ categoryName }): string => categoryName
            ),
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
