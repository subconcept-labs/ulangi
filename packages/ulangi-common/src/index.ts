/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { convertToComparableVersion } from './utils/convertToComparableVersion';

// Use require here because packagejson fall outside of root dir
// eslint-disable-next-line
const pk = require('../package.json');

export const currentComparableCommonVersion = convertToComparableVersion(
  pk.version
);
