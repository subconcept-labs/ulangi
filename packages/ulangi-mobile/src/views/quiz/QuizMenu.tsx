/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { QuizScreenIds } from '../../constants/ids/QuizScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { DefaultButton } from '../common/DefaultButton';

export interface QuizMenuProps {
  startWritingQuiz: () => void;
  startMultipleChoiceQuiz: () => void;
  showSettings: () => void;
}

export class QuizMenu extends React.Component<QuizMenuProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultButton
          testID={QuizScreenIds.MULTIPLE_CHOICE_BTN}
          text="Multiple Choice"
          styles={LessonScreenStyle.getPrimaryMenuButtonStyles()}
          onPress={this.props.startMultipleChoiceQuiz}
        />
        <DefaultButton
          testID={QuizScreenIds.WRITING_BTN}
          text="Writing"
          styles={LessonScreenStyle.getPrimaryMenuButtonStyles()}
          onPress={this.props.startWritingQuiz}
        />
        <DefaultButton
          testID={QuizScreenIds.SETTINGS_BTN}
          text="Settings"
          styles={LessonScreenStyle.getSecondaryMenuButtonStyles()}
          onPress={this.props.showSettings}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 42,
  },
});
