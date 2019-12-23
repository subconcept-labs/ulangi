/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  SectionRowStyles,
  darkStyles,
  lightStyles,
} from '../section/SectionRow.style';

export interface SectionRowProps {
  theme: Theme;
  testID?: string;
  leftIcon?: React.ReactElement<any>;
  leftText?: string;
  customLeft?: React.ReactElement<any>;
  rightText?: string;
  rightIcon?: React.ReactElement<any>;
  customRight?: React.ReactElement<any>;
  showArrow?: boolean;
  disabled?: boolean;
  description?: React.ReactElement<any> | string;
  shrink?: 'left' | 'right';
  onPress?: () => void;
  styles?: {
    light: SectionRowStyles;
    dark: SectionRowStyles;
  };
}

export class SectionRow extends React.Component<SectionRowProps> {
  public get styles(): SectionRowStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;

    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    if (typeof this.props.onPress !== 'undefined') {
      return (
        <TouchableOpacity
          testID={this.props.testID}
          style={this.styles.outer_container}
          disabled={this.props.disabled}
          onPress={this.props.onPress}>
          {this.renderInner()}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={this.styles.outer_container}>{this.renderInner()}</View>
      );
    }
  }

  private renderInner(): React.ReactElement<any> {
    const disabled_container =
      this.props.disabled === true ? this.styles.disabled_container : null;

    return (
      <View style={[this.styles.inner_container, disabled_container]}>
        <View style={this.styles.row_container}>
          {this.renderLeft()}
          {this.renderRight()}
        </View>
        {this.props.description ? (
          <View style={this.styles.description_container}>
            {React.isValidElement(this.props.description) ? (
              this.props.description
            ) : (
              <DefaultText style={this.styles.description_text}>
                {this.props.description}
              </DefaultText>
            )}
          </View>
        ) : null}
      </View>
    );
  }

  private renderLeft(): React.ReactElement<any> {
    const shrink_left = this.props.shrink === 'left' ? { flexShrink: 1 } : {};
    return (
      <View style={[this.styles.left, shrink_left]}>
        {typeof this.props.customLeft !== 'undefined'
          ? this.props.disabled === true
            ? React.cloneElement(this.props.customLeft, {
                disabled: true,
              })
            : this.props.customLeft
          : this.renderLeftText()}
      </View>
    );
  }

  private renderLeftText(): React.ReactElement<any> {
    const disabled_left_text =
      this.props.disabled === true ? this.styles.disabled_left_text : null;

    return (
      <React.Fragment>
        {typeof this.props.leftIcon !== 'undefined'
          ? this.props.leftIcon
          : null}
        <DefaultText style={[this.styles.left_text, disabled_left_text]}>
          {this.props.leftText}
        </DefaultText>
      </React.Fragment>
    );
  }

  private renderRight(): React.ReactElement<any> {
    const shrink_right = this.props.shrink === 'right' ? { flexShrink: 1 } : {};
    return (
      <View style={[this.styles.right, shrink_right]}>
        {typeof this.props.customRight !== 'undefined'
          ? this.props.disabled === true
            ? React.cloneElement(this.props.customRight, {
                disabled: true,
              })
            : this.props.customRight
          : this.renderRightText()}
      </View>
    );
  }

  private renderRightText(): React.ReactElement<any> {
    const shrink_right_text =
      this.props.shrink === 'right' ? { flexShrink: 1 } : {};
    return (
      <React.Fragment>
        <DefaultText
          style={[this.styles.right_text, shrink_right_text]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {this.props.rightText}
        </DefaultText>
        {typeof this.props.rightIcon !== 'undefined'
          ? this.props.rightIcon
          : null}
        {this.props.showArrow === true ? (
          <Image
            style={this.styles.caret}
            source={Images.CARET_RIGHT_GREY_10X18}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
