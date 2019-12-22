/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

#!/usr/bin/env node

import {
  DatabaseManagerFacade,
  ShardDatabaseFacade,
  ShardDbConfig,
} from '@ulangi/ulangi-remote-database';
import chalk from 'chalk';
import * as program from 'commander';
import * as inquirer from 'inquirer';

import { loadConfig } from '../setup/loadConfig';

async function exec(): Promise<void> {
  const config = loadConfig();

  program
    .option('-h, --host <host>', 'Database host')
    .option('-u, --user <user>', 'Database user')
    .option('-p, --port <port>', 'Database port')
    .option('-s, --shardIds <shardIds>', 'Shard IDs')
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
      name: 'shardIdsStr',
      message: 'Enter shard IDs (seperated by comma): ',
      default: program.shardIds || '',
    },
  ]);

  const { host, port, user, password, shardIdsStr } = answers;

  try {
    const shardIds: number[] = shardIdsStr.split(',').map(
      (shardId: string): number => {
        return parseInt(shardId.trim().replace(/\\ /g, ' '));
      }
    );

    for (const shardId of shardIds) {
      const databaseManager = new DatabaseManagerFacade();

      const databaseName = config.shardDb.shardDatabaseNamePrefix + shardIds;

      process.stdout.write(`Creating database ${databaseName}... `);
      const existed = await databaseManager.databaseExists(
        host,
        port,
        user,
        password,
        databaseName
      );

      if (existed === false) {
        await databaseManager.createShardDatabaseIfNotExist(
          {
            shardId,
            host,
            port,
            user,
            password,
            connectionLimit: 20,
          },
          config.shardDb.shardDatabaseNamePrefix
        );

        process.stdout.write(chalk.green('Okay\n'));
      } else {
        process.stdout.write(chalk.red('Already existed. Skipped\n'));
      }
    }

    const shardDatabase = new ShardDatabaseFacade(
      shardIds.map(
        (shardId): ShardDbConfig => {
          return {
            shardId,
            host,
            port,
            user,
            password,
            connectionLimit: 20,
          };
        }
      ),
      config.shardDb.shardDatabaseNamePrefix
    );

    for (const shardId of shardIds) {
      process.stdout.write(
        `Checking and migrating database with shardId ${shardId}... `
      );
      await shardDatabase.checkShardDatabaseTables(shardId);
      process.stdout.write(
        `Checked database with shardId ${shardId} completed.`
      );
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }

  process.stdout.write(chalk.blue('Completed\n'));
  process.exit();
}

exec();
