#!/usr/bin/env node

/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as program from 'commander';

program
  .command('create-page-index', 'Create page index')
  .command('delete-page-index', 'Delete page index')
  .command('seed', 'Seed data to elastic server')
  .parse(process.argv);
