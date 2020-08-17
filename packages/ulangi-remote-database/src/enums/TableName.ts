/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export enum TableName {
  // For auth database
  AUTH_DB_INFO = 'ulangi_auth_db_info',
  USER = 'ulangi_user',
  USER_EXTRA_DATA = 'ulangi_user_extra_data',
  API_KEY = 'ulangi_api_key',
  PURCHASE = 'ulangi_purchase',
  RESET_PASSWORD_REQUEST = 'ulangi_reset_password_request',
  DAILY_STREAK = 'ulangi_daily_streak',

  // For shard database
  SHARD_DB_INFO = 'ulangi_shard_db_info',
  SET = 'ulangi_set',
  SET_EXTRA_DATA = 'ulangi_set_extra_data',
  VOCABULARY = 'ulangi_vocabulary',
  VOCABULARY_CATEGORY = 'ulangi_vocabulary_category',
  VOCABULARY_WRITING = 'ulangi_vocabulary_writing',
  DEFINITION = 'ulangi_definition',
  LOCK = 'ulangi_lock',
  LESSON_RESULT = 'ulangi_lesson_result',
}
