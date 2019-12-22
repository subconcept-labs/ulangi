/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Definition } from '@ulangi/ulangi-common/interfaces';

import { DefinitionRow } from '../interfaces/DefinitionRow';

export class DefinitionRowConverter {
  public convertToDefinition(definitionRow: DefinitionRow): Definition {
    const definition: Definition = {
      definitionId: definitionRow.definitionId,
      meaning: definitionRow.meaning,
      wordClasses: JSON.parse(definitionRow.wordClasses),
      definitionStatus: definitionRow.definitionStatus,
      source: definitionRow.source,
      createdAt: definitionRow.createdAt,
      updatedAt: definitionRow.updatedAt,
      updatedStatusAt: definitionRow.updatedStatusAt,
      firstSyncedAt: definitionRow.firstSyncedAt,
      lastSyncedAt: definitionRow.lastSyncedAt,
      extraData: [],
    };
    return definition;
  }
}
