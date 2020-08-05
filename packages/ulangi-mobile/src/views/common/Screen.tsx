import { ObservableScreen } from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  LayoutChangeEvent,
  SafeAreaView,
  View,
  ViewProperties,
} from 'react-native';

export interface ScreenProps extends ViewProperties {
  observableScreen: ObservableScreen;
  useSafeAreaView: boolean;
}

@observer
export class Screen extends React.Component<ScreenProps> {
  @boundMethod
  public onLayout(event: LayoutChangeEvent): void {
    const { width, height } = event.nativeEvent.layout;
    this.props.observableScreen.screenLayout.update(width, height);
  }

  public render(): React.ReactElement<any> {
    if (this.props.useSafeAreaView) {
      return (
        <SafeAreaView onLayout={this.onLayout} {...this.props}>
          {this.props.children}
        </SafeAreaView>
      );
    } else {
      return (
        <View onLayout={this.onLayout} {...this.props}>
          {this.props.children}
        </View>
      );
    }
  }
}
