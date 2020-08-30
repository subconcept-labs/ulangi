import { ActivityState } from '@ulangi/ulangi-common/enums';
import { ObservableHeatMapState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Spinner } from '../common/Spinner';
import { HeatMap } from './HeatMap';
import {
  HeatMapContainer,
  ViewHeatMapButton,
  ViewHeatMapButtonContainer,
  Wrapper,
} from './ProgressHeatMapSection.style';
import {
  ErrorMessage,
  Note,
  SpinnerContainer,
  Subtitle,
  Title,
  TouchableText,
} from './ProgressScreen.style';

export interface HeatMapProps {
  heatMapState: ObservableHeatMapState;
  getHeatMapData: () => void;
  showFullHeatMap: () => void;
}

export const ProgressHeatMapSection = observer(
  (props: HeatMapProps): React.ReactElement => (
    <Wrapper>
      <Title>Heat Map</Title>
      <Subtitle>Last {props.heatMapState.numberOfDays} days</Subtitle>
      {props.heatMapState.fetchState === ActivityState.ERROR ? (
        <ErrorMessage>
          Error: Cannot fetch heat map data. Please check internet connection
          and{' '}
          <TouchableText onClick={props.getHeatMapData}>
            try again.
          </TouchableText>
        </ErrorMessage>
      ) : props.heatMapState.data !== null ? (
        <React.Fragment>
          <HeatMapContainer>
            <HeatMap
              range={props.heatMapState.range}
              data={props.heatMapState.data}
              heatMapLayout={props.heatMapState.layout}
            />
          </HeatMapContainer>
          <Note>
            * Only spaced repetition and writing reviews are counted (quiz and
            games are not).
          </Note>
          <ViewHeatMapButtonContainer>
            <ViewHeatMapButton onClick={props.showFullHeatMap}>
              View full heat map
            </ViewHeatMapButton>
          </ViewHeatMapButtonContainer>
        </React.Fragment>
      ) : (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
    </Wrapper>
  ),
);
