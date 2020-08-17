import { ActivityState } from '@ulangi/ulangi-common/enums';
import { Statistics } from '@ulangi/ulangi-common/interfaces';
import { observable } from 'mobx';

export class ObservableStatisticsState {
  @observable
  public statistics: null | Statistics;

  @observable
  public fetchState: ActivityState;

  public constructor(statistics: null | Statistics, fetchState: ActivityState) {
    this.statistics = statistics;
    this.fetchState = fetchState;
  }
}
