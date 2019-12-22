/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { User } from '@ulangi/ulangi-common/interfaces';

export interface AuthenticatedUser extends User {
  shardId: number;
  encryptedPassword: string;
  accessKey: string;
}
