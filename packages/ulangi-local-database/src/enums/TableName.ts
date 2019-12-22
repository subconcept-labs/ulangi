/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export enum TableName {
  SESSION = 'ulangi_session',
  USER = 'ulangi_user',
  USER_EXTRA_DATA = 'ulangi_user_extra_data',
  SET = 'ulangi_set',
  SET_EXTRA_DATA = 'ulangi_set_extra_data',
  VOCABULARY = 'ulangi_vocabulary',
  VOCABULARY_CATEGORY = 'ulangi_vocabulary_category',
  VOCABULARY_WRITING = 'ulangi_vocabulary_writing',
  DEFINITION = 'ulangi_definition',
  VOCABULARY_FTS4 = 'ulangi_vocabulary_fts4',
  DEFINITION_FTS4 = 'ulangi_definition_fts4',
  DIRTY_USER_FIELD = 'ulangi_dirty_user_field',
  DIRTY_SET_FIELD = 'ulangi_dirty_set_field',
  DIRTY_VOCABULARY_FIELD = 'ulangi_dirty_vocabulary_field',
  DIRTY_DEFINITION_FIELD = 'ulangi_dirty_definition_field',
  DIRTY_VOCABULARY_WRITING_FIELD = 'ulangi_dirty_vocabulary_writing_field',
  INCOMPATIBLE_SET = 'ulangi_incompatible_set',
  INCOMPATIBLE_VOCABULARY = 'ulangi_incompatible_vocabulary',
}
