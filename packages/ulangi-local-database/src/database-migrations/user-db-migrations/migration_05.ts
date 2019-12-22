/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';
import { UserMembership } from '@ulangi/ulangi-common/enums';

import { TableName } from '../../enums/TableName';

// Add membership and membershipExpiredAt
export function migration_05(tx: Transaction): void {
  addMembershipColumnToUserTable(tx);
  addMembershipExpiredAtColumnToUserTable(tx);
}

function addMembershipColumnToUserTable(tx: Transaction): void {
  tx.executeSql(`
    ALTER TABLE ${TableName.USER} 
      ADD COLUMN membership VARCHAR(60) NOT NULL DEFAULT '${
        UserMembership.REGULAR
      }';
  `);
}

function addMembershipExpiredAtColumnToUserTable(tx: Transaction): void {
  tx.executeSql(`
    ALTER TABLE ${TableName.USER} 
      ADD COLUMN membershipExpiredAt DATETIME;
  `);
}
