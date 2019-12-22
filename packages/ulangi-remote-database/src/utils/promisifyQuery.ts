/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

// Convert query builder to promise thus the query will be executed rightaway
export function promisifyQuery(
  query: knex.QueryBuilder | knex.Raw
): Promise<any> {
  return new Promise(
    (resolve, reject): void => {
      query.then(resolve, reject);
    }
  );
}
