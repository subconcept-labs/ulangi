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
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  PickerErrorStyles,
  pickerErrorResponsiveStyles,
} from './PickerError.style';

export interface PickerErrorProps {
  testID?: string;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  errorMessage: React.ReactElement<DefaultText> | string;
  styles?: {
    light: PickerErrorStyles;
    dark: PickerErrorStyles;
  };
}

@observer
export class PickerError extends React.Component<PickerErrorProps> {
  public get styles(): PickerErrorStyles {
    return pickerErrorResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
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
