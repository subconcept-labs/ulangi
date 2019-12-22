/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

#!/usr/bin/env node

import * as program from 'commander';

program
  .command('create-auth-database', 'Create auth database')
  .alias('create-auth-db')
  .command('create-shard-database', 'Create sharded database')
  .alias('create-shard-db')
  .command('drop', 'Drop database')
  .parse(process.argv);
