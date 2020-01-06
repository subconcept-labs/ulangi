#!/usr/bin/env node

/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as program from 'commander';

program
  .command('database', 'Database related scripts')
  .alias('db')
  .command('dictionary', 'Dictionary related scripts')
  .alias('dict')
  .command('library', 'Library related scripts')
  .alias('lib')
  .command('eb', 'Elastic beanstalk related scripts')
  .parse(process.argv);
