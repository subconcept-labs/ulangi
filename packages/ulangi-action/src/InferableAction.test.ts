/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from './ActionType';
import { InferableAction } from './InferableAction';

describe('InferableAction', (): void => {
  it('instantiate InferableAction', (): void => {
    const action = new InferableAction('any_action', null);
    expect(action.type).toEqual('any_action');
    expect(action.payload).toEqual(null);
  });

  test('is() type guard', (): void => {
    const action = new InferableAction(ActionType.APP__INITIALIZE, null);
    expect(action.is(ActionType.APP__INITIALIZE)).toEqual(true);
    expect(action.is(ActionType.APP__INITIALIZING)).toEqual(false);
  });
});
