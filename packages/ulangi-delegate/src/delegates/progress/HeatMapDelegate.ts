import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableHeatMapState } from '@ulangi/ulangi-observable';

export class HeatMapDelegate {
  private eventBus: EventBus;
  private heatMapState: ObservableHeatMapState;

  public constructor(eventBus: EventBus, heatMapState: ObservableHeatMapState) {
    this.eventBus = eventBus;
    this.heatMapState = heatMapState;
  }

  public getHeatMapData(): void {
    const [startDate, endDate] = this.heatMapState.range;

    this.eventBus.pubsub(
      createAction(ActionType.STATISTICS__GET_HEAT_MAP_DATA, {
        startDate,
        endDate,
      }),
      group(
        on(
          ActionType.STATISTICS__GETTING_HEAT_MAP_DATA,
          (): void => {
            this.heatMapState.fetchState = ActivityState.ACTIVE;
          }
        ),
        once(
          ActionType.STATISTICS__GET_HEAT_MAP_DATA_SUCCEEDED,
          ({ data }): void => {
            this.heatMapState.data = data;
            this.heatMapState.fetchState = ActivityState.INACTIVE;
          }
        ),
        once(
          ActionType.STATISTICS__GET_HEAT_MAP_DATA_FAILED,
          (): void => {
            this.heatMapState.data = null;
            this.heatMapState.fetchState = ActivityState.ERROR;
          }
        )
      )
    );
  }

  public switchLayout(): void {
    if (this.heatMapState.layout === 'continuous') {
      this.heatMapState.layout = 'month-by-month';
    } else {
      this.heatMapState.layout = 'continuous';
    }
  }

  public setLayout(layout: 'continuous' | 'month-by-month'): void {
    this.heatMapState.layout = layout;
  }
}
