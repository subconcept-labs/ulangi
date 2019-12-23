/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { LearnScreenIds } from '../../constants/ids/LearnScreenIds';
import { QuizTitle } from '../../views/quiz/QuizTitle';
import { SpacedRepetitionTitle } from '../../views/spaced-repetition/SpacedRepetitionTitle';
import { WritingTitle } from '../../views/writing/WritingTitle';
import { LearnListStyles, darkStyles, lightStyles } from './LearnList.style';

export interface LearnListProps {
  theme: Theme;
  navigateToSpacedRepetitionScreen: () => void;
  navigateToWritingScreen: () => void;
  navigateToQuizScreen: () => void;
  styles?: {
    light: LearnListStyles;
    dark: LearnListStyles;
  };
}

export class LearnList extends React.Component<LearnListProps> {
  public get styles(): LearnListStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        testID={LearnScreenIds.LEARN_LIST}
        contentContainerStyle={this.styles.scroll_view_container}>
        <TouchableOpacity
          testID={LearnScreenIds.SPACED_REPETITION_BTN}
          style={this.styles.learn_item}
          onPress={this.props.navigateToSpacedRepetitionScreen}>
          <View style={this.styles.spaced_repetition_title_container}>
            <SpacedRepetitionTitle theme={this.props.theme} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          testID={LearnScreenIds.WRITING_BTN}
          style={this.styles.learn_item}
          onPress={this.props.navigateToWritingScreen}>
          <View style={this.styles.writing_title_container}>
            <WritingTitle theme={this.props.theme} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          testID={LearnScreenIds.QUIZ_BTN}
          style={this.styles.learn_item}
          onPress={this.props.navigateToQuizScreen}>
          <View style={this.styles.quiz_title_container}>
            <QuizTitle theme={this.props.theme} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
