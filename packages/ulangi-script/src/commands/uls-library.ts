/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

#!/usr/bin/env node

import * as program from 'commander';

program
  .command('create-set-index', 'Create set index')
  .command('delete-set-index', 'Delete set index')
  .command('seed', 'Seed data')
  .parse(process.argv);
