import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { VocabularyLocalData } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';
import { VocabularyLocalDataRowPreparer } from '../preparers/VocabularyLocalDataRowPreparer';
import { VocabularyLocalDataRowResolver } from '../resolvers/VocabularyLocalDataRowResolver';

export class VocabularyLocalDataModel {
  private vocabularyLocalDataRowPreparer = new VocabularyLocalDataRowPreparer();
  private vocabularyLocalDataRowResolver = new VocabularyLocalDataRowResolver();

  public upsertVocabularyLocalData(
    tx: Transaction,
    vocabularyLocalData: VocabularyLocalData,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): void {
    const vocabularyLocalDataRow = this.vocabularyLocalDataRowPreparer.prepareUpsert(
      vocabularyLocalData,
      vocabularyId
    );

    const insertOrIgnoreQuery = squel
      .insertOrIgnore()
      .into(TableName.VOCABULARY_LOCAL_DATA)
      .setFields(vocabularyLocalDataRow)
      .toParam();

    const updateFields = _.omit(vocabularyLocalDataRow, ['vocabularyId']);

    const updateQueries = _.map(
      updateFields,
      (fieldValue, fieldName): squel.ParamString => {
        if (source === 'remote' && fieldName === 'vocabularyTerm') {
          return squel
            .update()
            .set('vocabularyTerm', fieldValue)
            .table(TableName.VOCABULARY_LOCAL_DATA)
            .where('vocabularyId = ?', vocabularyId)
            .where(
              'NOT EXISTS ?',
              squel
                .select()
                .from(TableName.DIRTY_VOCABULARY_FIELD)
                .where('vocabularyId = ?', vocabularyId)
                .where('fieldName = ?', 'vocabularyText')
            )
            .toParam();
        } else {
          return squel
            .update()
            .set(fieldName, fieldValue)
            .table(TableName.VOCABULARY_LOCAL_DATA)
            .where('vocabularyId = ?', vocabularyId)
            .toParam();
        }
      }
    );

    updateQueries.forEach(
      (query): void => {
        tx.executeSql(query.text, query.values);
      }
    );
    tx.executeSql(insertOrIgnoreQuery.text, insertOrIgnoreQuery.values);
  }

  public vocabularyTermsExist(
    db: SQLiteDatabase,
    vocabularyTerms: string[]
  ): Promise<string[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.VOCABULARY_LOCAL_DATA, 'l')
            .left_join(
              TableName.VOCABULARY,
              'v',
              'l.vocabularyId = v.vocabularyId'
            )
            .where(
              `l.vocabularyTerm IN (${vocabularyTerms
                .map((): string => '?')
                .join(',')})`,
              ...vocabularyTerms
            )
            .where('v.vocabularyStatus != ?', VocabularyStatus.DELETED)
            .toParam();

          const result = await db.executeSql(query.text, query.values);

          const vocabularyLocalDataRows = this.vocabularyLocalDataRowResolver.resolveArray(
            result.rows.slice(),
            true
          );

          resolve(
            vocabularyLocalDataRows
              .map(
                (row): string | null => {
                  return row.vocabularyTerm;
                }
              )
              .filter(
                (vocabularyTerm): vocabularyTerm is string => {
                  return vocabularyTerm !== null;
                }
              )
          );
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
