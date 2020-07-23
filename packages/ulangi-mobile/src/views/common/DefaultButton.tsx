/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import * as React from 'react';
import {
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProperties,
  View,
} from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface DefaultButtonProps extends TouchableOpacityProperties {
  testID?: string;
  text: string;
  styles?: ButtonStyles;
  disabled?: boolean;
  icon?: React.ReactElement<any>;
  cancelPressOnMove?: boolean;
  onPress?: () => void;
}

export class DefaultButton extends React.Component<DefaultButtonProps> {
  public render(): React.ReactElement<any> {
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState): boolean => {
        const { dx, dy } = gestureState;
        return dx > 5 || dx < -5 || dy > 5 || dy < -5;
      },
    });

    if (this.props.cancelPressOnMove === true) {
      return <View {...panResponder.panHandlers}>{this.renderButton()}</View>;
    } else {
      return this.renderButton();
    }
  }

  private renderButton(): React.ReactElement<any> {
    const disabledTextStyle =
      this.props.disabled === true &&
      typeof this.props.styles !== 'undefined' &&
      typeof this.props.styles.disabledTextStyle !== 'undefined'
        ? this.props.styles.disabledTextStyle
        : {};
    const disabledButtonStyle =
      this.props.disabled === true &&
      typeof this.props.styles !== 'undefined' &&
      this.props.styles.disabledButtonStyle !== 'undefined'
        ? this.props.styles.disabledButtonStyle
        : {};

    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[
          styles.touchable,
          this.props.styles && this.props.styles.buttonStyle,
          disabledButtonStyle,
        ]}
        onPress={this.props.onPress}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <DefaultText
          style={[
            this.props.styles && this.props.styles.textStyle,
            disabledTextStyle,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {this.props.text}
        </DefaultText>
        {typeof this.props.icon !== 'undefined' ? this.props.icon : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
