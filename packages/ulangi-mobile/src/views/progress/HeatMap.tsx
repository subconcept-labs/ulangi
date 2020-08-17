import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';
import {
  HeatMapStyles,
  heatMapResponsiveStyles,
} from '../progress/HeatMap.style';

export interface HeatMapProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  range: [Date, Date];
  data: (number | null)[];
  heatMapLayout: 'continuous' | 'month-by-month';
  showDataPoint: (date: Date, value: string | number) => void;
}

@observer
export class HeatMap extends React.Component<HeatMapProps> {
  private get styles(): HeatMapStyles {
    return heatMapResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        {this.props.heatMapLayout === 'continuous'
          ? this.renderContinuous()
          : this.renderMonthByMonth()}
      </View>
    );
  }

  private renderContinuous(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.props.data.map(
          (count, index): React.ReactElement<any> => {
            const date = this.getDateByIndex(index);

            return this.renderItem(index.toString(), date, count);
          },
        )}
      </React.Fragment>
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
      <React.Fragment>
        {_.map(
          dateCountPairsByMonth,
          (pairs, month): React.ReactElement<any> => {
            return (
              <View key={month} style={this.styles.month_container}>
                <DefaultText style={this.styles.month}>{month}</DefaultText>
                <View style={this.styles.container}>
                  {pairs.map(
                    ([date, count], index): React.ReactElement<any> => {
                      return this.renderItem(index.toString(), date, count);
                    },
                  )}
                </View>
              </View>
            );
          },
        )}
      </React.Fragment>
    );
  }

  private renderItem(
    key: string,
    date: Date,
    count: null | number,
  ): React.ReactElement<any> {
    const styles = this.getStylesByValue(count);

    return (
      <TouchableOpacity
        key={key}
        style={[this.styles.item, styles]}
        onPress={(): void => {
          this.props.showDataPoint(date, count === null ? 'N/A' : count);
        }}
      />
    );
  }

  private getDateByIndex(index: number): Date {
    const [startDate] = this.props.range;

    return moment(startDate)
      .add(index, 'days')
      .toDate();
  }

  private getStylesByValue(value: null | number): ViewStyle {
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
