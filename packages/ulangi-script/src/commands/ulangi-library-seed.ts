#!/usr/bin/env node

/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DictionaryFacade } from '@ulangi/ulangi-dictionary';
import { CSVParser, LibraryFacade } from '@ulangi/ulangi-library';
import * as appRoot from 'app-root-path';
import * as AWS from 'aws-sdk';
import chalk from 'chalk';
import { ChildProcess } from 'child_process';
import * as commander from 'commander';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as URL from 'url';

import { spawnProcess } from '../utils/spawnProcess';
import { waitForProcessToEnd } from '../utils/waitForProcessToEnd';

exec();

const enum FileType {
  WIKTIONARY_JSON_FILE = 'Wiktionary JSON Files',
  GOOGLE_SHEETS_CSV_FILE = 'Google Sheets CSV Files',
}

async function exec(): Promise<void> {
  commander
    .option('-e, --endpoint <endpoint>', 'Elasticsearch endpoint')
    .option('-i, --inputDirOrFile <inputDirOrFile>', 'Input folder or file')
    .parse(process.argv);

  const answers: any = await inquirer.prompt([
    {
      type: 'input',
      name: 'endpoint',
      message: 'Enter endpoint: ',
      default: commander.endpoint || 'http://localhost',
    },
    {
      type: 'list',
      name: 'awsConfigLoading',
      choices: [
        { value: 'file', name: 'from the credential file' },
        { value: 'manually', name: 'set manually' },
      ],
      default: 'file',
      message:
        'Do you want to load AWS credentials from the ~./aws/credential file or set it manually?',
    },
    {
      when: (answers: any): boolean => answers.awsConfigLoading === 'manually',
      type: 'input',
      name: 'awsAccessKeyId',
      message: 'Enter access key:',
    },
    {
      when: (answers: any): boolean => answers.awsConfigLoading === 'manually',
      type: 'input',
      name: 'awsSecretKey',
      message: 'Enter secret key:',
    },
    {
      type: 'list',
      name: 'region',
      choices: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'custom'],
      default: 'us-east-2',
      message: 'Select AWS region:',
    },
    {
      when: (answers: any): boolean => answers.region === 'custom',
      type: 'input',
      name: 'region',
      message: 'Enter AWS region:',
    },
    {
      type: 'input',
      name: 'inputDirOrFile',
      message: 'Enter input folder or file:',
      filter: (input): string => input.trim().replace(/\\ /g, ' '),
    },
    {
      type: 'list',
      name: 'fileType',
      choices: [FileType.WIKTIONARY_JSON_FILE, FileType.GOOGLE_SHEETS_CSV_FILE],
      default: 0,
      message: 'Select file type:',
    },
  ]);

  const {
    endpoint,
    awsConfigLoading,
    awsAccessKeyId,
    awsSecretKey,
    region,
    inputDirOrFile,
    fileType,
  } = answers;

  const host = URL.parse(endpoint).host;

  const awsConfig =
    awsConfigLoading === 'manually'
      ? new AWS.Config({
          credentials: new AWS.Credentials(awsAccessKeyId, awsSecretKey),
          region,
        })
      : new AWS.Config({
          credentials: new AWS.SharedIniFileCredentials(),
          region,
        });

  const inputFiles = [];
  if (fs.statSync(inputDirOrFile).isFile()) {
    inputFiles.push(inputDirOrFile);
  } else {
    inputFiles.push(
      ...fs.readdirSync(inputDirOrFile).map(
        (fileName): string => {
          return path.join(inputDirOrFile, fileName);
        }
      )
    );
  }

  const dictionary = new DictionaryFacade(endpoint, awsConfig);
  const library = new LibraryFacade(endpoint, dictionary, awsConfig);

  for (const inputFile of inputFiles) {
    const languageCodePair = path.parse(inputFile).name;

    try {
      process.stdout.write(
        `Checking if index for ${languageCodePair} exists... `
      );
      const existed = await library.indexForLanguagePairExists(
        languageCodePair
      );

      if (existed === false) {
        process.stdout.write(
          chalk.red(
            `Cannot seed because index for ${languageCodePair} did not exist\n`
          )
        );
      } else {
        process.stdout.write(chalk.green(`Okay\n`));
        process.stdout.write(
          chalk.green(`Running logstash. This may take some time...\n`)
        );

        const uploader = createLogstashUploader(
          assertExists(host),
          region,
          library.getIndexNameByLanguageCodePair(languageCodePair),
          assertExists(awsConfig.credentials)
        );

        if (fileType === FileType.WIKTIONARY_JSON_FILE) {
          const fileStream = fs.createReadStream(inputFile);
          const converter = createWiktionaryPageConverter();

          fileStream.pipe(converter.stdin);
          converter.stdout.pipe(uploader.stdin);
        } else {
          uploader.stdin.write(parseCSVFile(inputFile));
          uploader.stdin.end();
        }

        await waitForProcessToEnd(uploader);
        console.log(`Upload ${path.basename(inputFile)} completed.`);
      }
    } catch (error) {
      console.log(error);
      process.exit();
    }
  }
}

function createWiktionaryPageConverter(): ChildProcess {
  const childProcess = spawnProcess(
    path.join(
      appRoot.path,
      'bin',
      'scripts',
      'convertCategorizedPagesToPublicSets.js'
    ),
    [],
    { verbose: false, autoKillOnExit: true }
  );

  return childProcess;
}

function parseCSVFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  const csvParser = new CSVParser();
  const publicSets = csvParser.parse(content.toString());

  return (
    publicSets.map((set): string => JSON.stringify(set)).join('\r\n') + '\r\n'
  );
}

function createLogstashUploader(
  host: string,
  region: string,
  indexName: string,
  awsCredentials: { accessKeyId: string; secretAccessKey: string }
): ChildProcess {
  const args = [
    '--config.string',
    `
    input {
      stdin {}
    }

    filter {
      json {
        source => "message"
        remove_field => ["message", "endpoint", "path", "@version", "@timestamp"]
      }
    }

    output {
      amazon_es {
        hosts => ["${host}"]
        region => "${region}"
        aws_access_key_id => "${awsCredentials.accessKeyId}"
        aws_secret_access_key => "${awsCredentials.secretAccessKey}"
        index => "${indexName}"
        document_id => "%{publicSetId}"
      }
      stdout { codec => rubydebug }
    }
  `,
  ];

  const uploadProcess = spawnProcess('logstash', args, {
    verbose: true,
    autoKillOnExit: true,
  });

  return uploadProcess;
}
