/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProperties,
} from 'react-native';

import { config } from '../../constants/config';

class DecorateTextInput extends React.Component<
  TextInputProperties & {
    forwardedRef?: any;
  }
> {
  public render(): React.ReactElement<any> {
    const { forwardedRef, ...rest } = this.props;

    return (
      <TextInput
        ref={forwardedRef}
        allowFontScaling={false}
        {...rest}
        style={[styles.defaultTextInputStyle, this.props.style]}>
        {this.props.children}
      </TextInput>
    );
  }
}

// This component forwards ref to the inner TextInput
export const DefaultTextInput = React.forwardRef<
  TextInput,
  TextInputProperties
>(function decorateTextInput(props, ref): React.ReactElement<any> {
  return <DecorateTextInput forwardedRef={ref} {...props} />;
});

const styles = StyleSheet.create({
  defaultTextInputStyle: {
    fontFamily:
      Platform.OS === 'android'
        ? config.styles.androidMainFont
        : config.styles.iosMainFont,
  },
});
