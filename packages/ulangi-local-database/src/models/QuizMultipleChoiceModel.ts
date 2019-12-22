/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';
import { VocabularyRowResolver } from '../resolvers/VocabularyRowResolver';
import { addCategoryConditions } from '../utils/addCategoryConditions';
import { VocabularyModel } from './VocabularyModel';

export class QuizMultipleChoiceModel {
  private vocabularyRowResolver = new VocabularyRowResolver();

  private vocabularyModel: VocabularyModel;

  public constructor(vocabularyModel: VocabularyModel) {
    this.vocabularyModel = vocabularyModel;
  }

  public getVocabularyForMultipleChoiceQuiz(
    db: SQLiteDatabase,
    setId: string,
    vocabularyPool: 'learned' | 'active',
    startRange: number,
    endRange: number,
    stripUnknown: boolean,
    selectedCategoryNames: undefined | string[],
    excludedCategoryNames: undefined | string[]
  ): Promise<null | {
    vocabularyLocalIdPair: [Vocabulary, number];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const minLevel = vocabularyPool === 'active' ? 0 : 1;
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

          const query = buildingQuery
            .where('v.setId = ?', setId)
            .where('v.vocabularyStatus = ?', VocabularyStatus.ACTIVE)
            .where('v.level >= ?', minLevel)
            .where('v.vocabularyLocalId BETWEEN ? AND ?', startRange, endRange)
            .order('v.vocabularyLocalId')
            .limit(1)
            .toParam();

          const result = await db.executeSql(query.text, query.values);
          if (result.rows.length >= 1) {
            const item = result.rows[0];

            const vocabularyRow = this.vocabularyRowResolver.resolve(
              item,
              stripUnknown
            );

            const vocabulary = await this.vocabularyModel.getCompleteVocabularyByRow(
              db,
              vocabularyRow,
              stripUnknown
            );

            resolve({
              vocabularyLocalIdPair: [
                vocabulary,
                vocabularyRow.vocabularyLocalId,
              ],
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
