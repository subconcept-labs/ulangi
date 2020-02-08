/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundMethod } from 'autobind-decorator';
import * as React from 'react';
import {
  GestureResponderEvent,
  Keyboard,
  View,
  ViewProperties,
} from 'react-native';

export class DismissKeyboardView extends React.Component<ViewProperties> {
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

  public render(): React.ReactElement<any> {
    return (
      <View
        {...this.props}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
        onMoveShouldSetResponder={this.onMoveShouldSetResponder}
        onResponderRelease={this.onResponderRelease}>
        {this.props.children}
      </View>
    );
  }
}
