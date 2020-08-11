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

  public render(): null | React.ReactElement<any> {
    if (this.props.useSafeAreaView) {
      return (
        <SafeAreaView onLayout={this.onLayout} {...this.props}>
          {this.renderChildren()}
        </SafeAreaView>
      );
    } else {
      return (
        <View onLayout={this.onLayout} {...this.props}>
          {this.renderChildren()}
        </View>
      );
    }
  }

  private renderChildren(): React.ReactNode {
    if (
      this.props.observableScreen.screenLayout.height &&
      this.props.observableScreen.screenLayout.width
    ) {
      return this.props.children;
    } else {
      return null;
    }
  }
}
