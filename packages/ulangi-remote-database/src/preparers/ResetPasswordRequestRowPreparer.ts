/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Omit } from '@ulangi/extended-types';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';

import { ResetPasswordRequestRow } from '../interfaces/ResetPasswordRequestRow';

export class ResetPasswordRequestRowPreparer extends AbstractPreparer<
  ResetPasswordRequestRow
> {
  protected insertRules = {
    userId: Joi.string(),
    resetPasswordKey: Joi.string(),
    expiredAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  public prepareInsert(
    userId: string,
    resetPasswordKey: string
  ): Omit<ResetPasswordRequestRow, 'expiredAt'> {
    const data: Omit<
      { [P in keyof ResetPasswordRequestRow]: ResetPasswordRequestRow[P] },
      'expiredAt'
    > = {
      userId,
      resetPasswordKey,
    };

    return this.validateData(data, this.insertRules) as Omit<
      ResetPasswordRequestRow,
      'expiredAt'
    >;
  }
}
