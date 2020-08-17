import {
  ObservableLightBox,
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { View } from 'react-native';

import { HeatMapDataPointScreenDelegate } from '../../delegates/progress/HeatMapDataPointScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxContainerWithTitle } from '../light-box/LightBoxContainerWithTitle';
import {
  HeatMapDataPointScreenStyles,
  heatMapDataPointScreenResponsiveStyles,
} from '../progress/HeatMapDataPointScreen.style';

export interface HeatMapDataPointScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  screenDelegate: HeatMapDataPointScreenDelegate;
  date: Date;
  value: string | number;
}

@observer
export class HeatMapDataPointScreen extends React.Component<
  HeatMapDataPointScreenProps
> {
  private get styles(): HeatMapDataPointScreenStyles {
    return heatMapDataPointScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        useSafeAreaView={false}
        observableScreen={this.props.observableScreen}
        style={this.styles.screen}>
        <LightBoxContainerWithTitle
          theme={this.props.themeStore.theme}
          observableLightBox={this.props.observableLightBox}
          screenLayout={this.props.observableScreen.screenLayout}
          dismissLightBox={this.props.screenDelegate.dismissLightBox}
          title={moment(this.props.date).format('LL')}>
          <View style={this.styles.container}>
            <DefaultText style={this.styles.title}>Total reviews:</DefaultText>
            <DefaultText style={this.styles.value}>
              {this.props.value}
            </DefaultText>
          </View>
        </LightBoxContainerWithTitle>
      </Screen>
    );
  }
}
