/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface Config {
  shardDb: {
    shardDatabaseNamePrefix: string;
  };

  library: {
    defaultLanguageCodePairs: string[];
    maxPerSet: 100;
  };

  dictionary: {
    defaultLanguageCodePairs: string[];
  };
}
