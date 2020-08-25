import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, once } from '@ulangi/ulangi-event';
import { ObservableSetStore } from '@ulangi/ulangi-observable';

import { WritingSettingsDelegate } from './WritingSettingsDelegate';

export class WritingCountsDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private writingSettingsDelegate: WritingSettingsDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    writingSettingsDelegate: WritingSettingsDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.writingSettingsDelegate = writingSettingsDelegate;
  }

  public refreshDueAndNewCounts(
    categoryNames: undefined | string[],
    onFetchSucceeded: (dueCount: number, newCount: number) => void,
  ): void {
    this.clearDueAndNewCounts();
    this.fetchDueAndNewCounts(categoryNames, onFetchSucceeded);
  }

  public fetchDueAndNewCounts(
    categoryNames: undefined | string[],
    onFetchSucceeded: (dueCount: number, newCount: number) => void,
  ): void {
    const {
      initialInterval,
    } = this.writingSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.WRITING__FETCH_DUE_AND_NEW_COUNTS, {
        setId: this.setStore.existingCurrentSetId,
        initialInterval,
        categoryNames,
      }),
      group(
        once(
          ActionType.WRITING__FETCH_DUE_AND_NEW_COUNTS_SUCCEEDED,
          ({ dueCount, newCount }): void => {
            onFetchSucceeded(dueCount, newCount);
          },
        ),
      ),
    );
  }

  public clearDueAndNewCounts(): void {
    this.eventBus.publish(
      createAction(ActionType.WRITING__CLEAR_DUE_AND_NEW_COUNTS, null),
    );
  }
}
