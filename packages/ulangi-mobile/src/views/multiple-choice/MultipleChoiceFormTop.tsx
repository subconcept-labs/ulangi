/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableMultipleChoiceFormState,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  MultipleChoiceFormTopStyles,
  multipleChoiceFormTopResponsiveStyles,
} from './MultipleChoiceFormTop.style';

export interface MultipleChoiceFormTopProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  multipleChoiceFormState: ObservableMultipleChoiceFormState;
}

@observer
export class MultipleChoiceFormTop extends React.Component<
  MultipleChoiceFormTopProps
> {
  public get styles(): MultipleChoiceFormTopStyles {
    return multipleChoiceFormTopResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
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
