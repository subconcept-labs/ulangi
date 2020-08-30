import Tooltip from '@material-ui/core/Tooltip';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';

import { config } from '../../constants/config';
import {
  Item,
  ItemList,
  Month,
  MonthContainer,
  MonthList,
  TooltipContainer,
  TooltipText,
  TooltipTextContainer,
  TooltipTitle,
  Wrapper,
} from './HeatMap.style';

export interface HeatMapProps {
  range: [Date, Date];
  data: (number | null)[];
  heatMapLayout: 'continuous' | 'month-by-month';
}

@observer
export class HeatMap extends React.Component<HeatMapProps> {
  public render(): React.ReactElement<any> {
    return (
      <Wrapper>
        {this.props.heatMapLayout === 'continuous'
          ? this.renderContinuous()
          : this.renderMonthByMonth()}
      </Wrapper>
    );
  }

  private renderContinuous(): React.ReactElement<any> {
    return (
      <ItemList>
        {this.props.data.map(
          (count, index): React.ReactElement<any> => {
            const date = this.getDateByIndex(index);

            return this.renderItem(date.toString(), date, count);
          },
        )}
      </ItemList>
    );
  }

  private renderMonthByMonth(): React.ReactElement<any> {
    const dateCountPairs = this.props.data.map(
      (count, index): [Date, null | number] => {
        return [this.getDateByIndex(index), count];
      },
    );

    const dateCountPairsByMonth = _.groupBy(
      dateCountPairs,
      ([date]): string => {
        return moment(date).format('MMMM');
      },
    );

    return (
      <MonthList>
        {_.map(
          dateCountPairsByMonth,
          (pairs, month): React.ReactElement<any> => {
            return (
              <MonthContainer key={month}>
                <Month>{month}</Month>
                <ItemList>
                  {pairs.map(
                    ([date, count]): React.ReactElement<any> => {
                      return this.renderItem(date.toString(), date, count);
                    },
                  )}
                </ItemList>
              </MonthContainer>
            );
          },
        )}
      </MonthList>
    );
  }

  private renderItem(
    key: string,
    date: Date,
    count: null | number,
  ): React.ReactElement<any> {
    const styles = this.getStylesByValue(count);

    return (
      <React.Fragment key={key}>
        <Tooltip title={this.renderTooltipContent(date, count)} arrow>
          <Item style={styles} data-tip data-for={key} />
        </Tooltip>
      </React.Fragment>
    );
  }

  private renderTooltipContent(
    date: Date,
    count: null | number,
  ): React.ReactElement {
    return (
      <TooltipContainer>
        <TooltipTitle>{moment(date).format('LL')}</TooltipTitle>
        <TooltipTextContainer>
          <TooltipText>{count === null ? 'N/A' : count} reviews</TooltipText>
        </TooltipTextContainer>
      </TooltipContainer>
    );
  }

  private getDateByIndex(index: number): Date {
    const [startDate] = this.props.range;

    return moment(startDate)
      .add(index, 'days')
      .toDate();
  }

  private getStylesByValue(value: null | number): React.CSSProperties {
    const option = config.heatMap.mapping.find(
      (opt): boolean => {
        if (value === null) {
          return true;
        } else {
          const [start, end] = opt.range;

          return _.inRange(value, start, end + 1);
        }
      },
    );

    const styles = option
      ? option.styles
      : value !== null && value > config.heatMap.onFire.min
      ? config.heatMap.onFire.styles
      : config.heatMap.unavailable.styles;

    return styles;
  }
}
