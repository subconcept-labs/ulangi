/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserMembership } from '@ulangi/ulangi-common/enums';
import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_04(tx: knex.Transaction): Promise<void> {
  await addMembershipColumnsToUserTable(tx);
}

function addMembershipColumnsToUserTable(db: knex.Transaction): knex.Raw {
  return db.raw(`
    ALTER TABLE ${TableName.USER} 
      ADD membership VARCHAR(60) NOT NULL DEFAULT '${UserMembership.REGULAR}',
      ADD membershipExpiredAt DATETIME;
  `);
}
