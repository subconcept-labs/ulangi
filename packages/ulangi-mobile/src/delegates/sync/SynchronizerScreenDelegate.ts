/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SyncTask } from '@ulangi/ulangi-common/enums';
import { EventBus } from '@ulangi/ulangi-event';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';

@boundClass
export class SynchronizerScreenDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public triggerSync(): void {
    _.values(SyncTask).forEach(
      (syncTask: string): void => {
        this.eventBus.publish(
          createAction(ActionType.SYNC__ADD_SYNC_TASK, {
            syncTask: syncTask as SyncTask,
          })
        );
      }
    );
  }
}
