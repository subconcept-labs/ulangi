/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableMultipleChoiceFormState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  MultipleChoiceFormTopStyles,
  darkStyles,
  lightStyles,
} from './MultipleChoiceFormTop.style';

export interface MultipleChoiceFormTopProps {
  theme: Theme;
  multipleChoiceFormState: ObservableMultipleChoiceFormState;
  styles?: {
    light: MultipleChoiceFormTopStyles;
    dark: MultipleChoiceFormTopStyles;
  };
}

@observer
export class MultipleChoiceFormTop extends React.Component<
  MultipleChoiceFormTopProps
> {
  public get styles(): MultipleChoiceFormTopStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.number_container}>
          <DefaultText style={this.styles.number}>{`${this.props
            .multipleChoiceFormState.currentQuestionIndex + 1}/${
            this.props.multipleChoiceFormState.numOfQuestions
          }`}</DefaultText>
        </View>
        <View style={this.styles.note_container}>
          <DefaultText style={this.styles.note}>
            Select a correct answer
          </DefaultText>
        </View>
      </View>
    );
  }
}
