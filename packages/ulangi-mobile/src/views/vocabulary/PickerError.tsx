/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  PickerErrorStyles,
  darkStyles,
  lightStyles,
} from './PickerError.style';

export interface PickerErrorProps {
  testID?: string;
  theme: Theme;
  errorMessage: React.ReactElement<DefaultText> | string;
  styles?: {
    light: PickerErrorStyles;
    dark: PickerErrorStyles;
  };
}

@observer
export class PickerError extends React.Component<PickerErrorProps> {
  public get styles(): PickerErrorStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View testID={this.props.testID} style={this.styles.error_container}>
        <DefaultText style={this.styles.error_text}>
          {this.props.errorMessage}
        </DefaultText>
      </View>
    );
  }
}
