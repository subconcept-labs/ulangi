/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { SpacedRepetitionScheduler } from '@ulangi/ulangi-common/core';
import {
  VocabularySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';
import { VocabularyRowResolver } from '../resolvers/VocabularyRowResolver';
import { addVocabularySorting } from '../utils/addVocabularySorting';
import { VocabularyModel } from './VocabularyModel';

export class SpacedRepetitionModel {
  private spacedRepetitionScheduler = new SpacedRepetitionScheduler();
  private vocabularyRowResolver = new VocabularyRowResolver();

  private vocabularyModel: VocabularyModel;

  public constructor(vocabularyModel: VocabularyModel) {
    this.vocabularyModel = vocabularyModel;
  }

  public getNewVocabularyList(
    db: SQLiteDatabase,
    setId: string,
    categoryNames: undefined | string[],
    sortType: VocabularySortType,
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
            .from(TableName.VOCABULARY, 'v');

          if (typeof categoryNames !== 'undefined') {
            query = query.left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            );
            query = _.includes(categoryNames, 'Uncategorized')
              ? query.where(
                  'c.categoryName IN ? OR c.categoryName IS NULL',
                  categoryNames
                )
              : query.where('c.categoryName IN ?', categoryNames);
          }

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE);

          query = query.where('v.lastLearnedAt IS NULL');
          query = addVocabularySorting(query, sortType);
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

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getNewCount(
    db: SQLiteDatabase,
    setId: string,
    categoryNames: undefined | string[]
  ): Promise<number> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field('COUNT(v.vocabularyId)', 'newCount')
            .from(TableName.VOCABULARY, 'v');

          if (typeof categoryNames !== 'undefined') {
            query = query.left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            );
            query = _.includes(categoryNames, 'Uncategorized')
              ? query.where(
                  'c.categoryName IN ? OR c.categoryName IS NULL',
                  categoryNames
                )
              : query.where('c.categoryName IN ?', categoryNames);
          }

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE)
            .where('v.lastLearnedAt IS NULL');

          const queryParam = query.toParam();

          const result = await db.executeSql(
            queryParam.text,
            queryParam.values
          );

          resolve(parseInt(result.rows[0].newCount));
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getNewCountByCategoryNames(
    db: SQLiteDatabase,
    setId: string,
    categoryNames: string[]
  ): Promise<{ [P in string]: number }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field("IFNULL(c.categoryName, 'Uncategorized')", 'categoryName')
            .field('COUNT(v.vocabularyId)', 'newCount')
            .from(TableName.VOCABULARY, 'v');

          query = query.left_join(
            TableName.VOCABULARY_CATEGORY,
            'c',
            'v.vocabularyId = c.vocabularyId'
          );

          query = _.includes(categoryNames, 'Uncategorized')
            ? query.where(
                'c.categoryName IN ? OR c.categoryName IS NULL',
                categoryNames
              )
            : query.where('c.categoryName IN ?', categoryNames);

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE)
            .where('v.lastLearnedAt IS NULL');

          query = query.group("IFNULL(c.categoryName, 'Uncategorized')");

          const queryParam = query.toParam();

          const result = await db.executeSql(
            queryParam.text,
            queryParam.values
          );

          const categoryNameNewCountPairs = result.rows.map(
            (row): [string, number] => {
              return [row.categoryName, row.newCount];
            }
          );

          const newCountPerCategoryName = _.fromPairs(
            categoryNameNewCountPairs
          );

          resolve(
            _.fromPairs(
              categoryNames.map(
                (categoryName): [string, number] => {
                  return [
                    categoryName,
                    newCountPerCategoryName[categoryName] || 0,
                  ];
                }
              )
            )
          );
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
            query = _.includes(categoryNames, 'Uncategorized')
              ? query.where(
                  'c.categoryName IN ? OR c.categoryName IS NULL',
                  categoryNames
                )
              : query.where('c.categoryName IN ?', categoryNames);
          }

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE);

          query = this.addDueCondition(query, initialInterval, maxLevel);

          query = addVocabularySorting(query, sortType);

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

          resolve({ vocabularyList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getDueCount(
    db: SQLiteDatabase,
    setId: string,
    initialInterval: number,
    maxLevel: number,
    categoryNames: undefined | string[]
  ): Promise<number> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field('COUNT(v.vocabularyId)', 'dueCount')
            .from(TableName.VOCABULARY, 'v');

          if (typeof categoryNames !== 'undefined') {
            query = query.left_join(
              TableName.VOCABULARY_CATEGORY,
              'c',
              'v.vocabularyId = c.vocabularyId'
            );

            query = _.includes(categoryNames, 'Uncategorized')
              ? query.where(
                  'c.categoryName IN ? OR c.categoryName IS NULL',
                  categoryNames
                )
              : query.where('c.categoryName IN ?', categoryNames);
          }

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE);

          query = this.addDueCondition(query, initialInterval, maxLevel);

          const queryParam = query.toParam();

          const result = await db.executeSql(
            queryParam.text,
            queryParam.values
          );

          resolve(parseInt(result.rows[0].dueCount));
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getDueCountByCategoryNames(
    db: SQLiteDatabase,
    setId: string,
    initialInterval: number,
    maxLevel: number,
    categoryNames: string[]
  ): Promise<{ [P in string]: number }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let query = squel
            .select()
            .field("IFNULL(c.categoryName, 'Uncategorized')", 'categoryName')
            .field('COUNT(v.vocabularyId)', 'dueCount')
            .from(TableName.VOCABULARY, 'v');

          query = query.left_join(
            TableName.VOCABULARY_CATEGORY,
            'c',
            'v.vocabularyId = c.vocabularyId'
          );

          query = _.includes(categoryNames, 'Uncategorized')
            ? query.where(
                'c.categoryName IN ? OR c.categoryName IS NULL',
                categoryNames
              )
            : query.where('c.categoryName IN ?', categoryNames);

          query = query
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE);

          query = this.addDueCondition(query, initialInterval, maxLevel);

          query = query.group("IFNULL(c.categoryName, 'Uncategorized')");

          const queryParam = query.toParam();

          const result = await db.executeSql(
            queryParam.text,
            queryParam.values
          );

          const categoryNameDueCountPairs = result.rows.map(
            (row): [string, number] => {
              return [row.categoryName, row.dueCount];
            }
          );

          const dueCountPerCategoryName = _.fromPairs(
            categoryNameDueCountPairs
          );

          resolve(
            _.fromPairs(
              categoryNames.map(
                (categoryName): [string, number] => {
                  return [
                    categoryName,
                    dueCountPerCategoryName[categoryName] || 0,
                  ];
                }
              )
            )
          );
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
      'v.lastLearnedAt IS NOT NULL AND v.lastLearnedAt < ?',
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
