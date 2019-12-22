/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface AuthDbConfig {
  readonly host: string;
  readonly port: number;
  readonly databaseName: string;
  readonly user: string;
  readonly password: string;
  readonly connectionLimit: number;
}
