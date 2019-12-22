/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import chalk from 'chalk';
import * as _ from 'lodash';
import * as logSymbols from 'log-symbols';

import { LogLevel } from './LogLevel';

export class Logger {
  private logVerbosity: LogLevel;

  public constructor(logVerbosity: LogLevel) {
    this.logVerbosity = logVerbosity;
  }

  public info(...messages: string[]): void {
    this.log(LogLevel.INFO, messages);
  }

  public warn(...messages: string[]): void {
    this.log(LogLevel.WARN, messages);
  }

  public error(...messages: string[]): void {
    this.log(LogLevel.ERROR, messages);
  }

  private log(level: LogLevel, messages: string[]): void {
    const readableLevel = chalk.bold(
      level === LogLevel.ERROR
        ? chalk.red('error')
        : level === LogLevel.WARN
        ? chalk.yellow('warn')
        : level === LogLevel.INFO
        ? chalk.blue('info')
        : chalk.bold('unknown')
    );

    const text = [readableLevel, ...messages, '\n']
      .filter((part): boolean => !_.isUndefined(part))
      .join(' ');

    if (level >= this.logVerbosity) {
      process.stdout.write(text);

      // TODO: Log messages in the cloud
    }
  }
}

export function scope(text: string): string {
  return chalk.green(`[${text}]`);
}

export function logSymbol<K extends keyof typeof logSymbols>(
  symbolName: K
): string {
  return logSymbols[symbolName];
}
