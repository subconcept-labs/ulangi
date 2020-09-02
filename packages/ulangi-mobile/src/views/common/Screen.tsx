import { ObservableScreen, ObservableThemeStore } from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { ThemeProvider } from "styled-components";
import { ResponsiveContext } from "../../context/ResponsiveContext"
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
  themeStore: ObservableThemeStore;
  useSafeAreaView?: boolean;
  useDismissKeyboardView?: boolean;
}

@observer
export class Screen extends React.Component<ScreenProps> {

  private defaultScreenStyle = {
    flex: 1
  }

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
        <SafeAreaView onLayout={this.onLayout} {...props} style={[ this.defaultScreenStyle, this.props.style ]}>
          {this.renderChildren()}
        </SafeAreaView>
      );
    } else {
      return (
        <View onLayout={this.onLayout} {...props} style={[ this.defaultScreenStyle, this.props.style ]}>
          {this.renderChildren()}
        </View>
      );
    }
  }

  private renderChildren(): React.ReactNode {
    return (
      <ThemeProvider theme={this.props.themeStore.theme}>
        <ResponsiveContext.Provider value={
          {
            scaleByFactor: this.scaleByFactor,
            scaleByBreakpoints: this.scaleByBreakpoints,
            responsiveHorizontal: this.scaleByBreakpoints([16, 56, 106, 196])
          }
        }>
        {
          this.props.observableScreen.screenLayout.height &&
          this.props.observableScreen.screenLayout.width
          ? this.props.children
          : null
        }
        </ResponsiveContext.Provider>
      </ThemeProvider>
    )
  }

  @boundMethod
  protected scaleByFactor(
    value: number,
    factor: number = 0.1
  ): number {
    const currentWidth = this.props.observableScreen.screenLayout.width;

    const baseWidth = 350;
    // calculation from react-native-size-matters
    return Math.round(value + ((currentWidth / baseWidth) * value - value) * factor);
  }

  // scale by breakpoints
  @boundMethod
  protected scaleByBreakpoints(
    values: readonly [number, number, number, number],
  ): number {
    const width = this.props.observableScreen.screenLayout.width;

    // Portrait phones
    if (width < 576) {
      return values[0];
      // Landscape phones
    } else if (width < 768) {
      return values[1];
      // Portrait tablets
    } else if (width < 992) {
      return values[2];
      // Landscape tablets and desktops
    } else {
      return values[3];
    }
  }
}
