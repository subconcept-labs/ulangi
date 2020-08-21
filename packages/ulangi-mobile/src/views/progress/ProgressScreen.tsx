import { ActivityState, ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableProgressScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

import { ProgressScreenIds } from '../../constants/ids/ProgressScreenIds';
import { ProgressScreenDelegate } from '../../delegates/progress/ProgressScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import {
  ProgressScreenStyles,
  progressScreenResponsiveStyles,
} from '../progress/ProgressScreen.style';
import { HeatMap } from './HeatMap';

export interface ProgressScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableProgressScreen;
  screenDelegate: ProgressScreenDelegate;
}

@observer
export class ProgressScreen extends React.Component<ProgressScreenProps> {
  private get styles(): ProgressScreenStyles {
    return progressScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={ProgressScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}
        style={this.styles.screen}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.props.screenDelegate.refresh}
            />
          }>
          {this.renderHeatMap()}
          {this.renderStatistics()}
        </ScrollView>
      </Screen>
    );
  }

  private renderStatistics(): React.ReactElement<any> {
    return (
      <View style={this.styles.statistics_container}>
        <DefaultText style={this.styles.title}>STATISTICS</DefaultText>
        {this.props.observableScreen.statisticsState.fetchState ===
        ActivityState.ERROR ? (
          <DefaultText style={this.styles.error_message}>
            <DefaultText>
              Error: Cannot fetch statistics. Please check internet connection
              and{' '}
            </DefaultText>
            <DefaultText
              onPress={this.props.screenDelegate.getStatistics}
              style={this.styles.highlighted}>
              try again.
            </DefaultText>
          </DefaultText>
        ) : this.props.observableScreen.statisticsState.statistics !== null ? (
          <View style={this.styles.statistics_list}>
            <View style={this.styles.statistics_row}>
              <View style={this.styles.statistics_item}>
                <DefaultText style={this.styles.subtitle} numberOfLines={2}>
                  {'Total reviews\n(all time)'}
                </DefaultText>
                <DefaultText style={this.styles.count}>
                  {
                    this.props.observableScreen.statisticsState.statistics
                      .totalReviews
                  }
                </DefaultText>
              </View>
              <View style={this.styles.statistics_item}>
                <DefaultText style={this.styles.subtitle} numberOfLines={2}>
                  {'Average reviews\n(per day)'}
                </DefaultText>
                <DefaultText style={this.styles.count}>
                  {
                    this.props.observableScreen.statisticsState.statistics
                      .averageReviewsPerDay
                  }
                </DefaultText>
              </View>
            </View>
            <View style={this.styles.statistics_row}>
              <View style={this.styles.statistics_item}>
                <DefaultText style={this.styles.subtitle} numberOfLines={2}>
                  Longest streak
                </DefaultText>
                <DefaultText style={this.styles.count}>
                  {
                    this.props.observableScreen.statisticsState.statistics
                      .longestStreak
                  }
                </DefaultText>
              </View>
              <View style={this.styles.statistics_item}>
                <DefaultText style={this.styles.subtitle} numberOfLines={2}>
                  Most recent streak
                </DefaultText>
                <DefaultText style={this.styles.count}>
                  {
                    this.props.observableScreen.statisticsState.statistics
                      .latestStreak
                  }
                </DefaultText>
              </View>
            </View>
          </View>
        ) : (
          <ActivityIndicator style={this.styles.spinner} size="small" />
        )}
      </View>
    );
  }

  private renderHeatMap(): React.ReactElement<any> {
    return (
      <View style={this.styles.heat_map_container}>
        <DefaultText style={this.styles.title}>HEAT MAP</DefaultText>
        <DefaultText style={this.styles.subtitle}>
          Last {this.props.observableScreen.heatMapState.numberOfDays} days
        </DefaultText>
        {this.props.observableScreen.heatMapState.fetchState ===
        ActivityState.ERROR ? (
          <DefaultText style={this.styles.error_message}>
            <DefaultText>
              Error: Cannot fetch heat map data. Please check internet
              connection and{' '}
            </DefaultText>
            <DefaultText
              onPress={this.props.screenDelegate.getHeatMapData}
              style={this.styles.highlighted}>
              try again.
            </DefaultText>
          </DefaultText>
        ) : this.props.observableScreen.heatMapState.data !== null ? (
          <React.Fragment>
            <View style={this.styles.heat_map}>
              <HeatMap
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                range={this.props.observableScreen.heatMapState.range}
                data={this.props.observableScreen.heatMapState.data}
                heatMapLayout={this.props.observableScreen.heatMapState.layout}
                showDataPoint={(date, value): void => {
                  this.props.screenDelegate.showHeatMapDataPoint(date, value);
                }}
              />
            </View>
            <DefaultText style={this.styles.note}>
              * Only spaced repetition and writing reviews are counted (quiz and
              games are not).
            </DefaultText>
            <View style={this.styles.view_heat_map_button_container}>
              <DefaultButton
                text="View full heat map"
                onPress={this.props.screenDelegate.showFullHeatMap}
                styles={fullRoundedButtonStyles.getGreyOutlineStyles(
                  ButtonSize.SMALL,
                  this.props.themeStore.theme,
                  this.props.observableScreen.screenLayout,
                )}
              />
            </View>
          </React.Fragment>
        ) : (
          <ActivityIndicator style={this.styles.spinner} size="small" />
        )}
      </View>
    );
  }
}
