/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import * as Joi from 'joi';

type Rules<T> = { [P in keyof T]: Joi.SchemaLike };

export abstract class AbstractPreparer<T extends object> {
  protected insertRules?: Rules<T>;
  protected updateRules?: Rules<T>;
  protected upsertRules?: Rules<T>;

  protected validateData(data: any, rules: Rules<T>): DeepPartial<T> {
    const { error, value } = Joi.validate(data, rules, {
      stripUnknown: true,
      presence: 'required',
    });
    if (error) {
      throw error;
    } else {
      return value;
    }
  }

  protected isValidData(data: any, rules: Rules<T>): boolean {
    const { error } = Joi.validate(data, rules, {
      stripUnknown: true,
      presence: 'required',
    });
    return error === null;
  }
}
