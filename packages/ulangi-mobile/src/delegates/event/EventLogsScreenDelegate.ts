import {
  ObservableEventStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { RemoteLogger } from '../../RemoteLogger';
import { DialogDelegate } from '../dialog/DialogDelegate';

@boundClass
export class EventLogsScreenDelegate {
  private userStore: ObservableUserStore;
  private eventStore: ObservableEventStore;
  private dialogDelegate: DialogDelegate;

  public constructor(
    userStore: ObservableUserStore,
    eventStore: ObservableEventStore,
    dialogDelegate: DialogDelegate,
  ) {
    this.userStore = userStore;
    this.eventStore = eventStore;
    this.dialogDelegate = dialogDelegate;
  }

  public sendLogsToDevelopers(): void {
    RemoteLogger.logError({
      name: 'Event logs from ' + this.userStore.existingCurrentUser.email,
      message: JSON.stringify(
        this.eventStore.eventList
          .map(
            (action): string => {
              return action.type + '\n' + JSON.stringify(action.payload);
            },
          )
          .join('\n'),
      ),
    });

    this.dialogDelegate.showSuccessDialog({
      message: 'Sent successfully.',
    });
  }
}
