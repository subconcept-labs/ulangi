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
import { TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  SubmitButtonStyles,
  submitButtonResponsiveStyles,
} from './SubmitButton.style';

export interface SubmitButtonProps {
  testID: string;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  buttonText: string;
  onSubmit: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

@observer
export class SubmitButton extends React.Component<SubmitButtonProps> {
  private get styles(): SubmitButtonStyles {
    return submitButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[this.styles.button_touchable, this.props.style]}
        onPress={this.props.onSubmit}>
        <DefaultText style={[this.styles.button_text, this.props.textStyle]}>
          {this.props.buttonText}
        </DefaultText>
      </TouchableOpacity>
    );
  }
}
