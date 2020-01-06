#!/usr/bin/env node

/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  AuthDatabaseFacade,
  DatabaseManagerFacade,
} from '@ulangi/ulangi-remote-database';
import { default as chalk } from 'chalk';
import * as program from 'commander';
import * as inquirer from 'inquirer';

exec();

async function exec(): Promise<void> {
  program
    .option('-h, --host <host>', 'Database host')
    .option('-u, --user <user>', 'Database user')
    .option('-p, --port <port>', 'Database port')
    .option('-d, --database <database>', 'Database name')
    .parse(process.argv);

  const answers: any = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Enter host: ',
      default: program.host || 'localhost',
    },
    {
      type: 'input',
      name: 'port',
      message: 'Enter port: ',
      default: program.port || 3306,
    },
    {
      type: 'input',
      name: 'user',
      message: 'Enter user: ',
      default: program.user || 'root',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter password: ',
    },
    {
      type: 'input',
      name: 'database',
      message: 'Enter database: ',
      default: program.database || 'ulangi_auth',
    },
  ]);

  const { host, port, user, database, password } = answers;

  const databaseManager = new DatabaseManagerFacade();

  try {
    process.stdout.write(`Creating database... `);
    const existed = await databaseManager.databaseExists(
      host,
      port,
      user,
      password,
      database
    );

    if (existed === false) {
      await databaseManager.createAuthDatabaseIfNotExists({
        host,
        port,
        user,
        password,
        databaseName: database,
        connectionLimit: 20,
      });

      process.stdout.write(chalk.green('Okay\n'));
    } else {
      process.stdout.write(chalk.red('Already existed. Skipped\n'));
    }

    process.stdout.write('Checking and migrating database...\n');
    const authDatabase = new AuthDatabaseFacade({
      host,
      port,
      user,
      password,
      databaseName: database,
      connectionLimit: 20,
    });
    await authDatabase.checkAuthDatabaseTables();
    process.stdout.write('Check database completed.\n');
  } catch (error) {
    console.log(error);
    process.exit();
  }

  process.stdout.write(chalk.blue('Completed\n'));
  process.exit();
}
