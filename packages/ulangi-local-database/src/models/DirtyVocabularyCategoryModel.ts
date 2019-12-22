/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { VocabularyCategoryRowConverter } from '../converters/VocabularyCategoryRowConverter';
import { FieldState } from '../enums/FieldState';
import { TableName } from '../enums/TableName';
import { VocabularyCategoryRow } from '../interfaces/VocabularyCategoryRow';
import { VocabularyCategoryRowResolver } from '../resolvers/VocabularyCategoryRowResolver';

export class DirtyVocabularyCategoryModel {
  private vocabularyCategoryRowResolver = new VocabularyCategoryRowResolver();
  private vocabularyCategoryRowConverter = new VocabularyCategoryRowConverter();

  public getDirtyVocabularyCategoryForSyncing(
    db: SQLiteDatabase,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    vocabularyCategoryPerVocabularyId: { [P in string]: VocabularyCategory };
    markVocabularyCategoriesAsSynced: (
      tx: Transaction,
      syncedVocabularyIds: readonly string[]
    ) => void;
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          // Mark fields as preparing so any updates after that will reset back to TO_BE_SYNCED
          await db.transaction(
            (tx): void =>
              this.transitionFieldStates(tx, vocabularyIds, {
                fromAllStatesExcept: FieldState.SYNCED,
                toState: FieldState.SYNCING,
              })
          );

          const query = squel
            .select()
            .from(TableName.VOCABULARY_CATEGORY)
            .where(
              `vocabularyId IN (${vocabularyIds
                .map((): string => '?')
                .join(',')})`,
              ...vocabularyIds
            )
            .where('fieldState != ?', FieldState.SYNCED)
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const vocabularyCategoryRows = this.vocabularyCategoryRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const vocabularyCategoryRowPerVocabularyId = _.fromPairs(
            vocabularyCategoryRows.map(
              (row): [string, VocabularyCategoryRow] => [row.vocabularyId, row]
            )
          );

          const vocabularyCategoryPerVocabularyId = _.mapValues(
            vocabularyCategoryRowPerVocabularyId,
            (row): VocabularyCategory => {
              return this.vocabularyCategoryRowConverter.convertToVocabularyCategory(
                row
              );
            }
          );

          const markVocabularyCategoriesAsSynced = (
            tx: Transaction,
            syncedVocabularyIds: readonly string[]
          ): void => {
            this.transitionFieldStates(
              tx,
              vocabularyCategoryRows
                .filter(
                  (row): boolean =>
                    _.includes(syncedVocabularyIds, row.vocabularyId)
                )
                .map((row): string => row.vocabularyId),
              {
                fromState: FieldState.SYNCING,
                toState: FieldState.SYNCED,
              }
            );
          };

          resolve({
            vocabularyCategoryPerVocabularyId,
            markVocabularyCategoriesAsSynced,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public transitionFieldState(
    tx: Transaction,
    vocabularyId: string,
    transition: {
      fromState?: FieldState;
      fromAllStatesExcept?: FieldState;
      toState: FieldState;
    }
  ): void {
    let query;
    if (typeof transition.fromAllStatesExcept !== 'undefined') {
      query = squel
        .update()
        .table(TableName.VOCABULARY_CATEGORY)
        .where('vocabularyId = ?', vocabularyId)
        .where('fieldState != ?', transition.fromAllStatesExcept)
        .setFields({ fieldState: transition.toState })
        .toParam();
    } else if (typeof transition.fromState !== 'undefined') {
      query = squel
        .update()
        .table(TableName.VOCABULARY_CATEGORY)
        .where('vocabularyId = ?', vocabularyId)
        .where('fieldState = ?', transition.fromState)
        .setFields({ fieldState: transition.toState })
        .toParam();
    } else {
      query = squel
        .update()
        .table(TableName.VOCABULARY_CATEGORY)
        .where('vocabularyId = ?', vocabularyId)
        .setFields({ fieldState: transition.toState })
        .toParam();
    }

    tx.executeSql(query.text, query.values);
  }

  public transitionFieldStates(
    tx: Transaction,
    vocabularyIds: readonly string[],
    transition: {
      fromState?: FieldState;
      fromAllStatesExcept?: FieldState;
      toState: FieldState;
    }
  ): void {
    vocabularyIds.forEach(
      (vocabularyId): void => {
        this.transitionFieldState(tx, vocabularyId, transition);
      }
    );
  }
}
