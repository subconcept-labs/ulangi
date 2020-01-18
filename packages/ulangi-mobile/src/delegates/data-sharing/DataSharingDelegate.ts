import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, once } from '@ulangi/ulangi-event';
import {
  ObservableAdStore,
  ObservableUserStore,
  Observer,
} from '@ulangi/ulangi-observable';

import { RemoteLogger } from '../../RemoteLogger';

export class DataSharingDelegate {
  private eventBus: EventBus;
  private observer: Observer;
  private userStore: ObservableUserStore;
  private adStore: ObservableAdStore;

  public constructor(
    eventBus: EventBus,
    observer: Observer,
    userStore: ObservableUserStore,
    adStore: ObservableAdStore,
  ) {
    this.eventBus = eventBus;
    this.observer = observer;
    this.userStore = userStore;
    this.adStore = adStore;
  }

  public autoToggleDataSharing(): void {
    this.observer.reaction(
      (): {
        isInEEAOrUnknown: boolean;
        dataSharingOptedIn: undefined | boolean;
      } => {
        return {
          isInEEAOrUnknown: this.adStore.isRequestLocationInEeaOrUnknown,
          dataSharingOptedIn: this.userStore.existingCurrentUser
            .globalDataSharing,
        };
      },
      ({ isInEEAOrUnknown, dataSharingOptedIn }): void => {
        if (dataSharingOptedIn === true || isInEEAOrUnknown === false) {
          this.eventBus.pubsub(
            createAction(ActionType.DATA_SHARING__ENABLE_ANALYTICS, null),
            once(
              ActionType.DATA_SHARING__ENABLE_ANALYTICS_SUCCEEDED,
              (): void => {
                RemoteLogger.analyticsEnabled = true;
                RemoteLogger.crashlyticsEnabled = true;
              },
            ),
          );
        } else {
          this.eventBus.pubsub(
            createAction(ActionType.DATA_SHARING__DISABLE_ANALYTICS, null),
            once(
              ActionType.DATA_SHARING__DISABLE_ANALYTICS_SUCCEEDED,
              (): void => {
                RemoteLogger.analyticsEnabled = false;
                RemoteLogger.crashlyticsEnabled = false;
              },
            ),
          );
        }
      },
    );
  }
}
