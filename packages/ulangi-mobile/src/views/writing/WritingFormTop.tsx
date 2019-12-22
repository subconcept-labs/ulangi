/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableWritingFormState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { WritingFormIds } from '../../constants/ids/WritingFormIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import {
  WritingFormTopStyles,
  darkStyles,
  lightStyles,
} from './WritingFormTop.style';

export interface WritingFormTopProps {
  theme: Theme;
  writingFormState: ObservableWritingFormState;
  showLastWritten: boolean;
  skip?: () => void;
  styles?: {
    light: WritingFormTopStyles;
    dark: WritingFormTopStyles;
  };
}

@observer
export class WritingFormTop extends React.Component<WritingFormTopProps> {
  public get styles(): WritingFormTopStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.top_container}>
          <View style={this.styles.placeholder} />
          <View style={this.styles.number_container}>
            <DefaultText style={this.styles.number}>{`${this.props
              .writingFormState.currentQuestionIndex + 1}/${
              this.props.writingFormState.numOfQuestions
            }`}</DefaultText>
          </View>
          {typeof this.props.skip !== 'undefined' &&
          this.props.writingFormState.isCurrentAnswerCorrect === false ? (
            <View style={this.styles.button_container}>
              <DefaultButton
                testID={WritingFormIds.SKIP_BTN}
                text="Skip"
                styles={FullRoundedButtonStyle.getFullGreyBackgroundStyles(
                  ButtonSize.SMALL
                )}
                onPress={this.props.skip}
              />
            </View>
          ) : (
            <View style={this.styles.placeholder} />
          )}
        </View>
        {this.props.showLastWritten === true ? (
          <View style={this.styles.note_container}>
            <DefaultText style={this.styles.note}>
              {typeof this.props.writingFormState.currentQuestion
                .testingVocabulary.writing !== 'undefined' &&
              this.props.writingFormState.currentQuestion.testingVocabulary
                .writing.hasBeenWrittenBefore === true
                ? 'Last written ' +
                  this.props.writingFormState.currentQuestion.testingVocabulary
                    .writing.lastWrittenFromNow
                : 'First time writing this term'}
            </DefaultText>
          </View>
        ) : null}
      </View>
    );
  }
}
