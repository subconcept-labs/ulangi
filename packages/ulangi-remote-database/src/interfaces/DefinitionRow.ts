/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { DefinitionStatus } from '@ulangi/ulangi-common/enums';

export interface DefinitionRow {
  readonly userId: string;
  readonly definitionId: string;
  readonly vocabularyId: string;
  readonly definitionStatus: DefinitionStatus;
  readonly meaning: string;
  readonly wordClasses: string;
  readonly source: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly updatedStatusAt: Date;
  readonly firstSyncedAt: Date;
  readonly lastSyncedAt: Date;
}

export type DefinitionRowForInsert = Omit<
  DefinitionRow,
  'firstSyncedAt' | 'lastSyncedAt'
>;
export type DefinitionRowForUpdate = DeepPartial<DefinitionRow>;
