/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { runInAction } from 'mobx';
import { Action, AnyAction, Dispatch, Middleware } from 'redux';

// This middleware makes sure all actions are executed in a transaction
export function transactionMiddleware(): ReturnType<Middleware> {
  return (next: Dispatch<Action>): Dispatch<Action> => {
    return <Action>(action: AnyAction): Action => {
      return runInAction((): Action => (next(action) as unknown) as Action);
    };
  };
}
