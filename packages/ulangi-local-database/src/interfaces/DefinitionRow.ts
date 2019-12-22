/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { DefinitionStatus } from '@ulangi/ulangi-common/enums';

export interface DefinitionRow {
  readonly definitionLocalId: number;
  readonly definitionId: string;
  readonly vocabularyId: string;
  readonly meaning: string;
  readonly wordClasses: string; // wordclasses is stored in database as JSON string not array
  readonly definitionStatus: DefinitionStatus;
  readonly source: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly updatedStatusAt: number;
  readonly firstSyncedAt: null | number;
  readonly lastSyncedAt: null | number;
}

export type DefinitionRowForInsert = Omit<DefinitionRow, 'definitionLocalId'>;

export type DefinitionRowForUpdate = DeepPartial<DefinitionRow>;
