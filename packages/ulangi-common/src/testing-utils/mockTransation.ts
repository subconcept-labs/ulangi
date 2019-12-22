/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

type ScopeFn = (scope: (tx: Transaction) => void) => Promise<Transaction>;

export function mockTransaction(tx: Transaction): jest.Mock<ScopeFn> {
  return jest.fn(
    async (scope: (tx: Transaction) => void): Promise<Transaction> => {
      scope(tx);
      return tx;
    }
  );
}
