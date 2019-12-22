/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { DefinitionStatus } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as squel from 'squel';

import { DefinitionRowConverter } from '../converters/DefinitionRowConverter';
import { TableName } from '../enums/TableName';
import { DirtyDefinitionModel } from '../models/DirtyDefinitionModel';
import { DefinitionRowPreparer } from '../preparers/DefinitionRowPreparer';
import { DefinitionRowResolver } from '../resolvers/DefinitionRowResolver';

export class DefinitionModel {
  private definitionRowResolver = new DefinitionRowResolver();
  private definitionRowConverter = new DefinitionRowConverter();
  private definitionRowPreparer = new DefinitionRowPreparer();

  private dirtyDefinitionModel: DirtyDefinitionModel;

  public constructor(dirtyDefinitionModel: DirtyDefinitionModel) {
    this.dirtyDefinitionModel = dirtyDefinitionModel;
  }

  public getDefinitionsByVocabularyId(
    db: SQLiteDatabase,
    vocabularyId: string,
    definitionStatus: DefinitionStatus,
    stripUnknown: boolean
  ): Promise<{
    definitionList: readonly Definition[];
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.DEFINITION)
            .where('vocabularyId = ?', vocabularyId)
            .where('definitionStatus = ?', definitionStatus)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          const definitionRows = this.definitionRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          const definitionList = definitionRows.map(
            (definitionRow): Definition => {
              return this.definitionRowConverter.convertToDefinition(
                definitionRow,
                []
              );
            }
          );

          resolve({ definitionList });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getDefinitionsByVocabularyIds(
    db: SQLiteDatabase,
    vocabularyIds: readonly string[],
    definitionStatus: DefinitionStatus,
    stripUnknown: boolean
  ): Promise<{
    definitionsPerVocabularyId: { [P in string]: readonly Definition[] };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const query = squel
            .select()
            .from(TableName.DEFINITION)
            .where(
              `vocabularyId IN (${vocabularyIds
                .map((): string => '?')
                .join(',')})`,
              ...vocabularyIds
            )
            .where('definitionStatus = ?', definitionStatus)
            .toParam();
          const result = await db.executeSql(query.text, query.values);

          const definitionRows = this.definitionRowResolver.resolveArray(
            result.rows.slice(),
            stripUnknown
          );

          // Group rows by vocabularyId.
          // groups here is an object.
          const definitionRowsPerVocabularyId = _.groupBy(
            definitionRows,
            (definitionRow): string => definitionRow.vocabularyId
          );

          // In this ordered map, key is the vocabularyId and value is the definitions (in object)
          const definitionsPerVocabularyId = _.mapValues(
            definitionRowsPerVocabularyId,
            (definitionRows): Definition[] => {
              return definitionRows.map(
                (definitionRow): Definition => {
                  return this.definitionRowConverter.convertToDefinition(
                    definitionRow,
                    []
                  );
                }
              );
            }
          );

          resolve({ definitionsPerVocabularyId });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public upsertDefinition(
    tx: Transaction,
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string,
    source: 'local' | 'remote'
  ): void {
    this.updateDefinition(tx, definition, vocabularyId, source);

    if (
      this.definitionRowPreparer.canPrepareInsert(
        definition,
        vocabularyId,
        source
      )
    ) {
      this.insertOrIgnoreDefinition(
        tx,
        definition as Definition,
        vocabularyId as string,
        source
      );
    }
  }

  public upsertDefinitions(
    tx: Transaction,
    definitionVocabularyIdPairs: readonly [
      DeepPartial<Definition>,
      string | undefined
    ][],
    source: 'local' | 'remote'
  ): void {
    definitionVocabularyIdPairs.forEach(
      ([definition, vocabularyId]): void => {
        this.upsertDefinition(tx, definition, vocabularyId, source);
      }
    );
  }

  private insertOrIgnoreDefinition(
    tx: Transaction,
    definition: Definition,
    vocabularyId: string,
    source: 'local' | 'remote'
  ): void {
    const definitionRow = this.definitionRowPreparer.prepareInsert(
      definition,
      vocabularyId,
      source
    );

    const query = squel
      .insertOrIgnore()
      .into(TableName.DEFINITION)
      .setFields(definitionRow)
      .toParam();

    /*
    const fullTextQuery = {
      text: `INSERT INTO OR IGNORE ${
        TableName.DEFINITION_FTS4
      } (docid, meaning) VALUES (last_insert_rowid(), ?)`,
      values: [definitionRow.meaning],
    };
     */

    // Insert full text data
    const fullTextQuery = squel
      .insertOrIgnore({ rawNesting: true })
      .into(TableName.DEFINITION_FTS4)
      .fromQuery(
        ['docid', 'meaning'],
        squel
          .select({ rawNesting: true })
          .field('definitionLocalId')
          .field('meaning')
          .from(TableName.DEFINITION)
          .where('definitionId = ?', definitionRow.definitionId)
      )
      .toParam();

    tx.executeSql(query.text, query.values);
    tx.executeSql(fullTextQuery.text, fullTextQuery.values);

    if (source === 'local') {
      this.dirtyDefinitionModel.insertOrIgnoreDirtyFields(
        tx,
        definitionRow.definitionId,
        _.keys(_.omit(definitionRow, 'definitionId'))
      );
    }
  }

  private updateDefinition(
    tx: Transaction,
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string,
    source: 'local' | 'remote'
  ): void {
    const definitionId = assertExists(definition.definitionId);

    const definitionRow = this.definitionRowPreparer.prepareUpdate(
      definition,
      vocabularyId,
      source
    );

    const updateFields =
      source === 'local'
        ? _.omit(definitionRow, [
            'definitionId',
            'createdAt',
            'firstSynced',
            'lastSyncedAt',
          ])
        : _.omit(definitionRow, ['definitionId', 'createdAt']);

    if (!_.isEmpty(updateFields)) {
      if (source === 'remote') {
        // Only update the fields that are not dirty
        const queries = _.map(
          updateFields,
          (fieldValue, fieldName): squel.ParamString => {
            return squel
              .update()
              .set(fieldName, fieldValue)
              .table(TableName.DEFINITION)
              .where('definitionId = ?', definitionId)
              .where(
                'NOT EXISTS ?',
                squel
                  .select()
                  .from(TableName.DIRTY_DEFINITION_FIELD)
                  .where('definitionId = ?', definitionId)
                  .where('fieldName = ?', fieldName)
              )
              .toParam();
          }
        );

        // Only update full text search when meaning changes
        const fullTextQuery =
          typeof updateFields.meaning !== 'undefined'
            ? squel
                .update()
                .set('meaning', updateFields.meaning)
                .table(TableName.DEFINITION_FTS4)
                .where(
                  'docid IN ?',
                  squel
                    .select()
                    .from(TableName.DEFINITION)
                    .field('definitionLocalId')
                    .where('definitionId = ?', definitionId)
                    .where(
                      'NOT EXISTS ?',
                      squel
                        .select()
                        .from(TableName.DIRTY_DEFINITION_FIELD)
                        .where('definitionId = ?', definitionId)
                        .where('fieldName = meaning')
                    )
                )
                .toParam()
            : undefined;

        // According to Sqlite docs, any UPDATE or DELETE operations must be applied first to the FTS table, and then to the external content table
        if (typeof fullTextQuery !== 'undefined') {
          tx.executeSql(fullTextQuery.text, fullTextQuery.values);
        }
        queries.forEach(
          (query): void => {
            tx.executeSql(query.text, query.values);
          }
        );
      } else {
        const query = squel
          .update()
          .table(TableName.DEFINITION)
          .setFields(updateFields)
          .where('definitionId = ?', definitionId)
          .toParam();

        // Only update full text search when meaning changes
        const fullTextQuery =
          typeof updateFields.meaning !== 'undefined'
            ? squel
                .update()
                .set('meaning', updateFields.meaning)
                .table(TableName.DEFINITION_FTS4)
                .where(
                  'docid IN ?',
                  squel
                    .select()
                    .from(TableName.DEFINITION)
                    .field('definitionLocalId')
                    .where('definitionId = ?', definitionId)
                )
                .toParam()
            : undefined;

        // According to Sqlite docs, any UPDATE or DELETE operations must be applied first to the FTS table, and then to the external content table
        if (typeof fullTextQuery !== 'undefined') {
          tx.executeSql(fullTextQuery.text, fullTextQuery.values);
        }
        tx.executeSql(query.text, query.values);

        // Mark fields as dirty
        this.dirtyDefinitionModel.insertOrReplaceDirtyFieldsIfDefinitionExists(
          tx,
          definitionId,
          _.keys(_.omit(definitionRow, 'definitionId'))
        );
      }
    }
  }
}
