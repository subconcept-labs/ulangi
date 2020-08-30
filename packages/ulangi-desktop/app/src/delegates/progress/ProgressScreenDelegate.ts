import { ActionType } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { HeatMapDelegate, StatisticsDelegate } from '@ulangi/ulangi-delegate';
import { EventBus, on } from '@ulangi/ulangi-event';
import { ObservableProgressScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class ProgressScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableProgressScreen;
  private statisticsDelegate: StatisticsDelegate;
  private heatMapDelegate: HeatMapDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableProgressScreen,
    statisticsDelegate: StatisticsDelegate,
    heatMapDelegate: HeatMapDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.statisticsDelegate = statisticsDelegate;
    this.heatMapDelegate = heatMapDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public getStatistics(): void {
    this.statisticsDelegate.getStatistics();
  }

  public getHeatMapData(): void {
    this.heatMapDelegate.getHeatMapData();
  }

  public refresh(): void {
    this.clear();
    this.statisticsDelegate.getStatistics();
    this.heatMapDelegate.getHeatMapData();
  }

  public clear(): void {
    this.observableScreen.heatMapState.data = null;
    this.observableScreen.statisticsState.statistics = null;
    this.observableScreen.shouldShowRefreshNotice.set(false);
  }

  public showFullHeatMap(): void {
    this.navigatorDelegate.push(ScreenName.HEAT_MAP_SCREEN, {});
  }

  public autoShowRefreshNotice(): void {
    this.eventBus.subscribe(
      on(
        ActionType.LESSON_RESULTS__UPLOAD_SUCCEEDED,
        (): void => {
          this.observableScreen.shouldShowRefreshNotice.set(true);
        },
      ),
    );
  }
}
