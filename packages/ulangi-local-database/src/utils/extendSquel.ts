/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import squel = require('squel');

squel.insertOrReplace = function(
  options?: squel.QueryBuilderOptions
): squel.Insert {
  return squel.insert(options || {}, [
    new squel.cls.StringBlock(options || {}, 'INSERT OR REPLACE'),
    new squel.cls.IntoTableBlock(options),
    new squel.cls.InsertFieldValueBlock(options),
    new squel.cls.InsertFieldsFromQueryBlock(options),
  ]) as squel.Insert;
};

squel.insertOrIgnore = function(
  options?: squel.QueryBuilderOptions
): squel.Insert {
  return squel.insert(options || {}, [
    new squel.cls.StringBlock(options || {}, 'INSERT OR IGNORE'),
    new squel.cls.IntoTableBlock(options),
    new squel.cls.InsertFieldValueBlock(options),
    new squel.cls.InsertFieldsFromQueryBlock(options),
  ]) as squel.Insert;
};
