/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ChildProcess, spawn } from 'child_process';

import { killProcessOnExit } from './killChildProcessOnExit';

interface Options {
  verbose: boolean;
  autoKillOnExit: boolean;
}

export function spawnProcess(
  cmd: string,
  args?: string[],
  options?: Partial<Options>
): ChildProcess {
  const childProcess = spawn(cmd, args);

  if (options && options.verbose) {
    childProcess.stdout.on(
      'data',
      (data): void => {
        console.log(`stdout: ${data}`);
      }
    );

    childProcess.stderr.on(
      'data',
      (data): void => {
        console.log(`stderr: ${data}`);
      }
    );

    childProcess.on(
      'close',
      (code): void => {
        console.log(`child process exited with code ${code}`);
      }
    );
  }

  if (options && options.autoKillOnExit) {
    killProcessOnExit(childProcess);
  }

  return childProcess;
}
