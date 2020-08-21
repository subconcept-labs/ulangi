import { ActivityState } from '@ulangi/ulangi-common/enums';
import {
  ObservableHeatMapScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { HeatMapScreenIds } from '../../constants/ids/HeatMapScreenIds';
import { HeatMapScreenDelegate } from '../../delegates/progress/HeatMapScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import {
  HeatMapScreenStyles,
  heatMapScreenResponsiveStyles,
} from '../progress/HeatMapScreen.style';
import { HeatMap } from './HeatMap';

export interface HeatMapScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableHeatMapScreen;
  screenDelegate: HeatMapScreenDelegate;
}

@observer
export class HeatMapScreen extends React.Component<HeatMapScreenProps> {
  private get styles(): HeatMapScreenStyles {
    return heatMapScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={HeatMapScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}
        style={this.styles.screen}>
        {this.renderTopBar()}
        {this.renderHeatMap()}
      </Screen>
    );
  }

  private renderTopBar(): React.ReactElement<any> {
    return (
      <View style={this.styles.top_bar}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
          style={this.styles.top_bar_button}>
          <DefaultText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={this.styles.top_bar_button_text}>
            Year 2020
          </DefaultText>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
          onPress={this.props.screenDelegate.switchLayout}
          style={this.styles.top_bar_button}>
          <DefaultText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={this.styles.top_bar_button_text}>
            {this.props.observableScreen.heatMapState.layout === 'continuous'
              ? 'Continuous'
              : 'Month-by-month'}
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }

  private renderHeatMap(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={this.styles.heat_map_container}>
        <DefaultText style={this.styles.year}>2020</DefaultText>
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
          <HeatMap
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            range={this.props.observableScreen.heatMapState.range}
            data={this.props.observableScreen.heatMapState.data}
            heatMapLayout={this.props.observableScreen.heatMapState.layout}
            showDataPoint={this.props.screenDelegate.showHeatMapDataPoint}
          />
        ) : (
          <ActivityIndicator style={this.styles.spinner} size="small" />
        )}
      </ScrollView>
    );
  }
}
