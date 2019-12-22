/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';

import { DefinitionRowConverter } from '../converters/DefinitionRowConverter';
import { TableName } from '../enums/TableName';
import { DefinitionRowForInsert } from '../interfaces/DefinitionRow';
import { DefinitionRowPreparer } from '../preparers/DefinitionRowPreparer';
import { DefinitionRowResolver } from '../resolvers/DefinitionRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class DefinitionModel {
  private definitionRowPreparer = new DefinitionRowPreparer();
  private definitionRowResolver = new DefinitionRowResolver();
  private definitionRowConverter = new DefinitionRowConverter();

  public getDefinitionsPerVocabularyId(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    vocabularyIds: readonly string[],
    stripUnknown: boolean
  ): Promise<{
    definitionsPerVocabularyId: { [P in string]: readonly Definition[] };
  }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.DEFINITION)
              .where('userId', userId)
              .whereIn('vocabularyId', vocabularyIds.slice())
          );

          const definitionRows = this.definitionRowResolver.resolveArray(
            result,
            stripUnknown
          );

          const definitionRowsPerVocabularyId = _.groupBy(
            definitionRows,
            (definitionRow): string => definitionRow.vocabularyId
          );

          const definitionsPerVocabularyId = _.mapValues(
            definitionRowsPerVocabularyId,
            (definitionRows): Definition[] => {
              return definitionRows.map(
                (definitionRow): Definition =>
                  this.definitionRowConverter.convertToDefinition(definitionRow)
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

  public upsertDefinitions(
    db: knex.Transaction,
    userId: string,
    definitionVocabularyIdPairs: readonly [
      DeepPartial<Definition>,
      string | undefined
    ][]
  ): Promise<void[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void | void[]>[] = [];

          // Insert definition queries
          queries.push(
            this.insertOrIgnoreDefinitions(
              db,
              userId,
              definitionVocabularyIdPairs.filter(
                (pair): pair is [Definition, string] => {
                  const [definition, vocabularyId] = pair;
                  return this.definitionRowPreparer.canPrepareInsert(
                    userId,
                    definition,
                    vocabularyId
                  );
                }
              )
            )
          );

          // Update definition queries
          queries.push(
            this.updateDefinitions(db, userId, definitionVocabularyIdPairs)
          );

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private insertOrIgnoreDefinitions(
    db: knex.Transaction,
    userId: string,
    definitionVocabularyIdPairs: readonly [Definition, string][]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          if (definitionVocabularyIdPairs.length > 0) {
            const definitionRows = definitionVocabularyIdPairs.map(
              ([definition, vocabularyId]): DefinitionRowForInsert => {
                return this.definitionRowPreparer.prepareInsert(
                  userId,
                  definition,
                  vocabularyId
                );
              }
            );

            const { sql, bindings } = db
              .insert(definitionRows)
              .into(TableName.DEFINITION)
              .toSQL();

            queries.push(
              promisifyQuery(
                db.raw(sql.replace('insert', 'insert ignore'), bindings)
              )
            );
          }

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private updateDefinitions(
    db: knex.Transaction,
    userId: string,
    definitionVocabularyIdPairs: readonly [
      DeepPartial<Definition>,
      string | undefined
    ][]
  ): Promise<void[]> {
    return Promise.all(
      definitionVocabularyIdPairs.map(
        ([definition, vocabularyId]): Promise<void> => {
          return this.updateDefinition(db, userId, definition, vocabularyId);
        }
      )
    );
  }

  private updateDefinition(
    db: knex.Transaction,
    userId: string,
    definition: DeepPartial<Definition>,
    vocabularyId: undefined | string
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          const definitionRow = this.definitionRowPreparer.prepareUpdate(
            userId,
            definition,
            vocabularyId
          );

          const definitionId = definitionRow.definitionId;
          const updateFields = _.omit(definitionRow, [
            'userId',
            'definitionId',
          ]);

          if (!_.isEmpty(updateFields)) {
            queries.push(
              promisifyQuery(
                db
                  .update(updateFields)
                  .table(TableName.DEFINITION)
                  .where({
                    userId,
                    definitionId,
                  })
              )
            );
          }

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
