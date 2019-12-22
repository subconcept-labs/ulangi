/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export enum DatabaseEvent {
  USER_UPDATED_FROM_LOCAL = 'USER_UPDATED_FROM_LOCAL',

  SET_INSERTED_FROM_LOCAL = 'SET_INSERTED_FROM_LOCAL',
  SET_UPDATED_FROM_LOCAL = 'SET_UPDATED_FROM_LOCAL',

  VOCABULARY_INSERTED_FROM_LOCAL = 'VOCABULARY_INSERTED_FROM_LOCAL',
  VOCABULARY_UPDATED_FROM_LOCAL = 'VOCABULARY_UPDATED_FROM_LOCAL',
}
