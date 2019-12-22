/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import * as semVer from 'semver';

export function convertToComparableVersion(version: string): string {
  const major = semVer.major(version);
  const minor = semVer.minor(version);
  const patch = semVer.patch(version);

  if (major > 9999 || minor > 9999 || patch > 9999) {
    throw new Error('major, minor, and patch cannot be greater than 9999.');
  }

  const comparableVersion =
    _.padStart(String(major), 4, '0') +
    '.' +
    _.padStart(String(minor), 4, '0') +
    '.' +
    _.padStart(String(patch), 4, '0');

  return comparableVersion;
}
