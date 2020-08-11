import { ObservableScreen } from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  GestureResponderEvent,
  Keyboard,
  LayoutChangeEvent,
  SafeAreaView,
  View,
  ViewProperties,
} from 'react-native';

export interface ScreenProps extends ViewProperties {
  observableScreen: ObservableScreen;
  useSafeAreaView?: boolean;
  useDismissKeyboardView?: boolean;
}

@observer
export class Screen extends React.Component<ScreenProps> {
  @boundMethod
  public onLayout(event: LayoutChangeEvent): void {
    const { width, height } = event.nativeEvent.layout;
    this.props.observableScreen.screenLayout.update(width, height);
  }

  // Dismiss keyboard on touch
  @boundMethod
  private onStartShouldSetResponder(): boolean {
    return true;
  }

  // Do not dismiss keyboard on move (when scrolling)
  @boundMethod
  private onMoveShouldSetResponder(): boolean {
    return false;
  }

  @boundMethod
  private onResponderRelease(event: GestureResponderEvent): void {
    Keyboard.dismiss();
    console.log(event.nativeEvent.touches);
    if (typeof this.props.onResponderRelease !== 'undefined') {
      this.props.onResponderRelease(event);
    }
  }

  public render(): null | React.ReactElement<any> {
    const props =
      this.props.useDismissKeyboardView === true
        ? {
            ...this.props,
            onStartShouldSetResponder: this.onStartShouldSetResponder,
            onMoveShouldSetResponder: this.onMoveShouldSetResponder,
            onResponderRelease: this.onResponderRelease,
          }
        : this.props;

    if (this.props.useSafeAreaView === true) {
      return (
        <SafeAreaView onLayout={this.onLayout} {...props}>
          {this.renderChildren()}
        </SafeAreaView>
      );
    } else {
      return (
        <View onLayout={this.onLayout} {...props}>
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
