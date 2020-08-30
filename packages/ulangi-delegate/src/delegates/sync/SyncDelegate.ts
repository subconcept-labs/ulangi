import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SyncTask } from '@ulangi/ulangi-common/enums';
import { EventBus, once } from '@ulangi/ulangi-event';
import * as _ from 'lodash';

export class SyncDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public syncEverything(): void {
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

  public uploadLocalChanges(): void {
    this.eventBus.publish(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.UPLOAD_USER,
      })
    );
    this.eventBus.publish(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.UPLOAD_SETS,
      })
    );
    this.eventBus.publish(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.UPLOAD_VOCABULARY,
      })
    );
  }

  public downloadAllSets(callback: { onDownloadCompleted: () => void }): void {
    this.eventBus.pubsub(
      createAction(ActionType.SYNC__ADD_SYNC_TASK, {
        syncTask: SyncTask.DOWNLOAD_SETS,
      }),
      once(ActionType.SYNC__SYNC_COMPLETED, callback.onDownloadCompleted)
    );
  }
}
