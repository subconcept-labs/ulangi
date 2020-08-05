/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  PickerLoadingStyles,
  pickerLoadingResponsiveStyles,
} from './PickerLoading.style';

export interface PickerLoadingProps {
  testID?: string;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  message: string;
  styles?: {
    light: PickerLoadingStyles;
    dark: PickerLoadingStyles;
  };
}

@observer
export class PickerLoading extends React.Component<PickerLoadingProps> {
  public get styles(): PickerLoadingStyles {
    return pickerLoadingResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View testID={this.props.testID} style={this.styles.spinner_container}>
        <ActivityIndicator style={this.styles.spinner} />
        <DefaultText style={this.styles.spinner_text}>
          {this.props.message}
        </DefaultText>
      </View>
    );
  }
}
