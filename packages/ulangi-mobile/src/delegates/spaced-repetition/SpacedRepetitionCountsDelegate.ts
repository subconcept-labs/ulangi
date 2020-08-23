import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, once } from '@ulangi/ulangi-event';
import { ObservableSetStore } from '@ulangi/ulangi-observable';

import { SpacedRepetitionSettingsDelegate } from './SpacedRepetitionSettingsDelegate';

export class SpacedRepetitionCountsDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
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
    } = this.spacedRepetitionSettingsDelegate.getCurrentSettings();

    this.eventBus.pubsub(
      createAction(ActionType.SPACED_REPETITION__FETCH_DUE_AND_NEW_COUNTS, {
        setId: this.setStore.existingCurrentSetId,
        initialInterval,
        categoryNames,
      }),
      group(
        once(
          ActionType.SPACED_REPETITION__FETCH_DUE_AND_NEW_COUNTS_SUCCEEDED,
          ({ dueCount, newCount }): void => {
            onFetchSucceeded(dueCount, newCount);
          },
        ),
      ),
    );
  }

  public clearDueAndNewCounts(): void {
    this.eventBus.publish(
      createAction(
        ActionType.SPACED_REPETITION__CLEAR_DUE_AND_NEW_COUNTS,
        null,
      ),
    );
  }
}
