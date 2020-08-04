/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { Platform, StyleSheet, Text, TextProperties } from 'react-native';

import { config } from '../../constants/config';

export class DefaultText extends React.Component<TextProperties> {
  public render(): React.ReactElement<any> {
    return (
      <Text
        allowFontScaling={false}
        {...this.props}
        style={[styles.defaultTextStyle, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  defaultTextStyle: {
    fontFamily:
      Platform.OS === 'android'
        ? config.styles.androidMainFont
        : config.styles.iosMainFont,
  },
});
