import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import {
  VocabularyBulkEdit,
  VocabularyFilterCondition,
} from '@ulangi/ulangi-common/types';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';

export class VocabularyBulkEditDelegate {
  private eventBus: EventBus;

  public constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public bulkEdit(
    filterCondition: VocabularyFilterCondition,
    edit: VocabularyBulkEdit,
    callback: {
      onBulkEditing: (updatedCount: number) => void;
      onBulkEditSucceeded: (totalCount: number) => void;
      onBulkEditFailed: (errorBag: ErrorBag) => void;
    }
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__BULK_EDIT, {
        filterCondition,
        edit,
      }),
      group(
        on(
          ActionType.VOCABULARY__BULK_EDITING,
          ({ updatedCount }): void => callback.onBulkEditing(updatedCount)
        ),
        once(
          ActionType.VOCABULARY__BULK_EDIT_SUCCEEDED,
          ({ totalCount }): void => callback.onBulkEditSucceeded(totalCount)
        ),
        once(
          ActionType.VOCABULARY__BULK_EDIT_FAILED,
          (errorBag): void => callback.onBulkEditFailed(errorBag)
        )
      )
    );
  }
}
