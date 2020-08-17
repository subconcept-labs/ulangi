import { ActivityState } from '@ulangi/ulangi-common/enums';
import { computed, observable } from 'mobx';
import * as moment from 'moment';

export class ObservableHeatMapState {
  @observable
  public range: [Date, Date];

  @observable
  public data: null | (number | null)[];

  @observable
  public layout: 'continuous' | 'month-by-month';

  @observable
  public fetchState: ActivityState;

  @computed
  public get numberOfDays(): number {
    const [startDate, endDate] = this.range;

    return moment(endDate).diff(moment(startDate), 'days') + 1;
  }

  public constructor(
    range: [Date, Date],
    data: null | (number | null)[],
    layout: 'continuous' | 'month-by-month',
    fetchState: ActivityState
  ) {
    this.range = range;
    this.data = data;
    this.layout = layout;
    this.fetchState = fetchState;
  }
}
