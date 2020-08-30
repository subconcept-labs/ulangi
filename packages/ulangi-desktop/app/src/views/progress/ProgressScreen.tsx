import { ObservableProgressScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ProgressScreenDelegate } from '../../delegates/progress/ProgressScreenDelegate';
import { TopBar } from '../common/TopBar';
import { ProgressHeatMapSection } from './ProgressHeatMapSection';
import { Screen, Wrapper } from './ProgressScreen.style';
import { ScrollableView } from "../common/ScrollableView"
import { ProgressStatisticsSection } from './ProgressStatisticsSection';

export interface ProgressScreenProps {
  observableScreen: ObservableProgressScreen;
  screenDelegate: ProgressScreenDelegate;
}

export const ProgressScreen = observer(
  (props: ProgressScreenProps): React.ReactElement => (
    <Screen>
      {props.observableScreen.topBar !== null &&
      props.observableScreen.topBar.kind === 'title' ? (
        <TopBar title={props.observableScreen.topBar.title} />
      ) : null}
        <ScrollableView>
          <Wrapper>
            <ProgressHeatMapSection
              heatMapState={props.observableScreen.heatMapState}
              getHeatMapData={props.screenDelegate.getHeatMapData}
              showFullHeatMap={props.screenDelegate.showFullHeatMap}
            />
            <ProgressStatisticsSection
              statisticsState={props.observableScreen.statisticsState}
              getStatistics={props.screenDelegate.getStatistics}
            />
          </Wrapper>
        </ScrollableView>
    </Screen>
  ),
);
