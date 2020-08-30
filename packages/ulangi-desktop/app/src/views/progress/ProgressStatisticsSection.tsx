import { ActivityState } from '@ulangi/ulangi-common/enums';
import { ObservableStatisticsState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Spinner } from '../common/Spinner';
import {
  ErrorMessage,
  SpinnerContainer,
  Subtitle,
  Title,
  TouchableText,
} from './ProgressScreen.style';
import {
  Count,
  StatisticsContainer,
  StatisticsItem,
  StatisticsList,
  StatisticsRow,
} from './ProgressStatisticsSection.style';

export interface ProgressStatisticsSectionProps {
  statisticsState: ObservableStatisticsState;
  getStatistics: () => void;
}

export const ProgressStatisticsSection = observer(
  (props: ProgressStatisticsSectionProps): React.ReactElement => (
    <StatisticsContainer>
      <Title>Statistics</Title>
      {props.statisticsState.fetchState === ActivityState.ERROR ? (
        <ErrorMessage>
          Error: Cannot fetch statistics. Please check internet connection and{' '}
          <TouchableText onClick={props.getStatistics}>
            try again.
          </TouchableText>
        </ErrorMessage>
      ) : props.statisticsState.statistics !== null ? (
        <StatisticsList>
          <StatisticsRow>
            <StatisticsItem>
              <Subtitle>
                Total reviews
                <br />
                (all time)
              </Subtitle>
              <Count>{props.statisticsState.statistics.totalReviews}</Count>
            </StatisticsItem>
            <StatisticsItem>
              <Subtitle>
                Average reviews
                <br />
                (per day)
              </Subtitle>
              <Count>
                {Math.round(
                  props.statisticsState.statistics.averageReviewsPerDay,
                )}
              </Count>
            </StatisticsItem>
            <StatisticsItem>
              <Subtitle>
                Highest reviews
                <br />
                (on a day)
              </Subtitle>
              <Count>{props.statisticsState.statistics.highestReviews}</Count>
            </StatisticsItem>
          </StatisticsRow>
          <StatisticsRow>
            <StatisticsItem>
              <Subtitle>
                Longest streak
                <br />
                (by days)
              </Subtitle>
              <Count>{props.statisticsState.statistics.longestStreak}</Count>
            </StatisticsItem>
            <StatisticsItem>
              <Subtitle>
                Most recent streak
                <br />
                (by days)
              </Subtitle>
              <Count>{props.statisticsState.statistics.latestStreak}</Count>
            </StatisticsItem>
          </StatisticsRow>
        </StatisticsList>
      ) : (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
    </StatisticsContainer>
  ),
);
