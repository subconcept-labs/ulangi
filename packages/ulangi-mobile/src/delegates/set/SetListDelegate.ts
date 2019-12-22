/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';

export class SetListDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public hasActiveSets(setList: readonly Set[]): boolean {
    const firstActiveSet = setList.find(
      (set): boolean => set.setStatus === SetStatus.ACTIVE
    );
    return typeof firstActiveSet !== 'undefined';
  }

  public selectFirstActiveSet(setList: readonly Set[]): void {
    const firstActiveSet = setList.find(
      (set): boolean => set.setStatus === SetStatus.ACTIVE
    );

    if (typeof firstActiveSet !== 'undefined') {
      this.eventBus.publish(
        createAction(ActionType.SET__SELECT, {
          setId: firstActiveSet.setId,
        })
      );
    }
  }
}
