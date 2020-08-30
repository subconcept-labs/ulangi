import { ActivityState } from '@ulangi/ulangi-common/enums';
import { ObservableHeatMapScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { HeatMapScreenDelegate } from '../../delegates/progress/HeatMapScreenDelegate';
import { BackButton } from '../common/BackButton';
import { Spinner } from '../common/Spinner';
import { TopBar } from '../common/TopBar';
import { HeatMap } from './HeatMap';
import {
  ErrorMessage,
  HeatMapContainer,
  OptionBarContainer,
  Screen,
  SpinnerContainer,
  TouchableText,
  Year,
} from './HeatMapScreen.style';
import { ScrollableView } from "../common/ScrollableView"
import { SelectLayout } from './SelectLayout';
import { SelectYear } from './SelectYear';

export interface HeatMapScreenProps {
  observableScreen: ObservableHeatMapScreen;
  screenDelegate: HeatMapScreenDelegate;
}

@observer
export class HeatMapScreen extends React.Component<HeatMapScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <Screen>
        {this.props.observableScreen.topBar !== null &&
        this.props.observableScreen.topBar.kind === 'title' ? (
          <TopBar
            title={this.props.observableScreen.topBar.title}
            leftButton={<BackButton back={this.props.screenDelegate.back} />}
          />
        ) : null}
        {this.renderOptionBar()}
        {this.renderHeatMap()}
      </Screen>
    );
  }

  private renderOptionBar(): React.ReactElement<any> {
    return (
      <OptionBarContainer>
        <SelectYear year={2020} />
        <SelectLayout
          layout={this.props.observableScreen.heatMapState.layout}
          setLayout={this.props.screenDelegate.setLayout}
        />
      </OptionBarContainer>
    );
  }

  private renderHeatMap(): React.ReactElement<any> {
    return (
      <ScrollableView>
        <HeatMapContainer>
          <Year>2020</Year>
          {this.props.observableScreen.heatMapState.fetchState ===
          ActivityState.ERROR ? (
            <ErrorMessage>
              Error: Cannot fetch heat map data. Please check internet
              connection and <br />
              <TouchableText onClick={this.props.screenDelegate.getHeatMapData}>
                try again.
              </TouchableText>
            </ErrorMessage>
          ) : this.props.observableScreen.heatMapState.data !== null ? (
            <HeatMap
              range={this.props.observableScreen.heatMapState.range}
              data={this.props.observableScreen.heatMapState.data}
              heatMapLayout={this.props.observableScreen.heatMapState.layout}
            />
          ) : (
            <SpinnerContainer>
              <Spinner />{' '}
            </SpinnerContainer>
          )}
        </HeatMapContainer>
      </ScrollableView>
    );
  }
}
