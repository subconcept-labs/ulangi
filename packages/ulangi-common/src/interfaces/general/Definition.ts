/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionStatus } from '../../enums/DefinitionStatus';
import { WordClass } from '../../enums/WordClass';

export interface Definition {
  readonly definitionId: string;
  readonly meaning: string;
  readonly wordClasses: readonly WordClass[];
  readonly definitionStatus: DefinitionStatus;
  readonly source: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly updatedStatusAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
  readonly extraData: readonly any[];
}
