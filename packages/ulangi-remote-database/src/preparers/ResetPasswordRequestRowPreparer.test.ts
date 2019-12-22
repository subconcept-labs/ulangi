/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ResetPasswordRequestRowPreparer } from '../preparers/ResetPasswordRequestRowPreparer';

describe('ResetPasswordRequestRowPreparer', (): void => {
  let resetPasswordRequestRowPreparer: ResetPasswordRequestRowPreparer;

  beforeEach(
    (): void => {
      resetPasswordRequestRowPreparer = new ResetPasswordRequestRowPreparer();
    }
  );

  test('prepare row for insert correctly', (): void => {
    const preparedRow = resetPasswordRequestRowPreparer.prepareInsert(
      'userId',
      'resetPasswordKey'
    );

    expect(preparedRow).toEqual({
      userId: 'userId',
      resetPasswordKey: 'resetPasswordKey',
    });
  });
});
