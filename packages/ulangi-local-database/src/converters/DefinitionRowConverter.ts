/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';

import { DefinitionRow } from '../interfaces/DefinitionRow';

export class DefinitionRowConverter {
  public convertToDefinition(
    definitionRow: DefinitionRow,
    extraData: any[]
  ): Definition {
    return {
      definitionId: definitionRow.definitionId,
      definitionStatus: definitionRow.definitionStatus,
      meaning: definitionRow.meaning,
      wordClasses: JSON.parse(definitionRow.wordClasses),
      source: definitionRow.source,
      createdAt: moment.unix(definitionRow.createdAt).toDate(),
      updatedAt: moment.unix(definitionRow.updatedAt).toDate(),
      updatedStatusAt: moment.unix(definitionRow.updatedStatusAt).toDate(),
      firstSyncedAt:
        definitionRow.firstSyncedAt !== null
          ? moment.unix(definitionRow.firstSyncedAt).toDate()
          : null,
      lastSyncedAt:
        definitionRow.lastSyncedAt !== null
          ? moment.unix(definitionRow.lastSyncedAt).toDate()
          : null,
      extraData,
    };
  }

  public convertToPartialDefinition(
    definitionRow: DeepPartial<DefinitionRow>,
    extraData: undefined | any[]
  ): DeepPartial<Definition> {
    return _.omitBy(
      {
        definitionId: definitionRow.definitionId,
        definitionStatus: definitionRow.definitionStatus,
        meaning: definitionRow.meaning,
        wordClasses:
          typeof definitionRow.wordClasses !== 'undefined'
            ? JSON.parse(definitionRow.wordClasses)
            : undefined,
        source: definitionRow.source,
        createdAt: definitionRow.createdAt
          ? moment.unix(definitionRow.createdAt).toDate()
          : definitionRow.createdAt,
        updatedAt: definitionRow.updatedAt
          ? moment.unix(definitionRow.updatedAt).toDate()
          : definitionRow.updatedAt,
        updatedStatusAt: definitionRow.updatedStatusAt
          ? moment.unix(definitionRow.updatedStatusAt).toDate()
          : definitionRow.updatedStatusAt,
        firstSyncedAt: definitionRow.firstSyncedAt
          ? moment.unix(definitionRow.firstSyncedAt).toDate()
          : definitionRow.firstSyncedAt,
        lastSyncedAt: definitionRow.lastSyncedAt
          ? moment.unix(definitionRow.lastSyncedAt).toDate()
          : definitionRow.lastSyncedAt,
        extraData,
      },
      _.isUndefined
    );
  }
}
