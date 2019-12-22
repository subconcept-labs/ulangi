/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';

import { ActionType } from './ActionType';
import { createAction } from './createAction';

describe('createAction', (): void => {
  it('create Action', (): void => {
    const action = createAction(ActionType.APP__INITIALIZE_FAILED, {
      errorCode: ErrorCode.GENERAL__UNKNOWN_ERROR,
    });
    expect(action.type).toEqual(ActionType.APP__INITIALIZE_FAILED);
    expect(action.payload).toEqual({
      errorCode: ErrorCode.GENERAL__UNKNOWN_ERROR,
    });
  });
});
