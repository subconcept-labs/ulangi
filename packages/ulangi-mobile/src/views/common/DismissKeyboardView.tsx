/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundMethod } from 'autobind-decorator';
import * as _ from 'lodash';
import * as React from 'react';
import {
  GestureResponderEvent,
  Keyboard,
  View,
  ViewProperties,
} from 'react-native';

export class DismissKeyboardView extends React.Component<ViewProperties> {
  @boundMethod
  private onStartShouldSetResponder(): boolean {
    return true;
  }

  @boundMethod
  private onResponderGrant(event: GestureResponderEvent): void {
    Keyboard.dismiss();
    if (typeof this.props.onResponderGrant !== 'undefined') {
      this.props.onResponderGrant(event);
    }
  }

  public render(): React.ReactElement<any> {
    const rest = _.omitBy(this.props, [
      'onStartShouldSetResponder',
      'onResponderGrant',
    ]);
    return (
      <View
        onStartShouldSetResponder={this.onStartShouldSetResponder}
        onResponderGrant={this.onResponderGrant}
        {...rest}>
        {this.props.children}
      </View>
    );
  }
}
