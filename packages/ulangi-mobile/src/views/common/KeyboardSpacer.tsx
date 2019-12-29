/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { EmitterSubscription, Keyboard, View } from 'react-native';

export interface KeyboardSpacerProps {
  verticalOffset?: number;
}

export interface KeyboardSpacerState {
  keyboardHeight: number;
}

export class KeyboardSpacer extends React.Component<
  KeyboardSpacerProps,
  KeyboardSpacerState
> {
  private keyboardWillHideListener?: EmitterSubscription;
  private keyboardDidHideListener?: EmitterSubscription;
  private keyboardDidShowListener?: EmitterSubscription;

  public constructor(props: KeyboardSpacerProps) {
    super(props);

    this.state = {
      keyboardHeight: 0,
    };
  }

  public componentDidMount(): void {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this),
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this),
    );
  }

  public componentWillUnmount(): void {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove();
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  private keyboardDidShow(event: any): void {
    const verticalOffset = this.props.verticalOffset || 0;
    this.setState({
      keyboardHeight: event.endCoordinates.height + verticalOffset,
    });
  }

  private keyboardWillHide(): void {
    this.setState({ keyboardHeight: 0 });
  }

  private keyboardDidHide(): void {
    this.setState({ keyboardHeight: 0 });
  }

  public render(): React.ReactElement<any> {
    return <View style={{ height: this.state.keyboardHeight }} />;
  }
}
