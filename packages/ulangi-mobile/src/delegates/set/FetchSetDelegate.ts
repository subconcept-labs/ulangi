/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';

export class FetchSetDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public fetchSets(
    setStatus: SetStatus,
    callback: {
      onFetching: () => void;
      onFetchSucceeded: (setList: readonly Set[]) => void;
      onFetchFailed: (errorCode: string) => void;
    },
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.SET__FETCH, { setStatus }),
      group(
        on(ActionType.SET__FETCHING, callback.onFetching),
        once(
          ActionType.SET__FETCH_SUCCEEDED,
          ({ setList }): void => callback.onFetchSucceeded(setList),
        ),
        once(
          ActionType.SET__FETCH_FAILED,
          ({ errorCode }): void => callback.onFetchFailed(errorCode),
        ),
      ),
    );
  }

  public fetchAllSets(callback: {
    onFetchingAll: () => void;
    onFetchAllSucceeded: (setList: readonly Set[]) => void;
    onFetchAllFailed: (errorCode: string) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.SET__FETCH_ALL, null),
      group(
        on(ActionType.SET__FETCHING_ALL, callback.onFetchingAll),
        once(
          ActionType.SET__FETCH_ALL_SUCCEEDED,
          ({ setList }): void => callback.onFetchAllSucceeded(setList),
        ),
        once(
          ActionType.SET__FETCH_ALL_FAILED,
          ({ errorCode }): void => callback.onFetchAllFailed(errorCode),
        ),
      ),
    );
  }
}
