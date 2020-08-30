import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableStatisticsState } from '@ulangi/ulangi-observable';

export class StatisticsDelegate {
  private eventBus: EventBus;
  private statisticsState: ObservableStatisticsState;

  public constructor(
    eventBus: EventBus,
    statisticsState: ObservableStatisticsState
  ) {
    this.eventBus = eventBus;
    this.statisticsState = statisticsState;
  }

  public getStatistics(): void {
    this.eventBus.pubsub(
      createAction(ActionType.STATISTICS__GET_STATISTICS, null),
      group(
        on(
          ActionType.STATISTICS__GETTING_STATISTICS,
          (): void => {
            this.statisticsState.fetchState = ActivityState.ACTIVE;
          }
        ),
        once(
          ActionType.STATISTICS__GET_STATISTICS_SUCCEEDED,
          ({ statistics }): void => {
            this.statisticsState.statistics = statistics;
            this.statisticsState.fetchState = ActivityState.INACTIVE;
          }
        ),
        once(
          ActionType.STATISTICS__GET_STATISTICS_FAILED,
          (): void => {
            this.statisticsState.statistics = null;
            this.statisticsState.fetchState = ActivityState.ERROR;
          }
        )
      )
    );
  }
}
