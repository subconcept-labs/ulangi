/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableDimensions } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { QuizScreenIds } from '../../constants/ids/QuizScreenIds';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ls, ss, xls } from '../../utils/responsive';
import { DefaultButton } from '../common/DefaultButton';

export interface QuizMenuProps {
  observableDimensions: ObservableDimensions;
  startWritingQuiz: () => void;
  startMultipleChoiceQuiz: () => void;
  showSettings: () => void;
}

@observer
export class QuizMenu extends React.Component<QuizMenuProps> {
  public render(): React.ReactElement<any> {
    return (
      <View
        style={[
          styles.container,
          {
            marginHorizontal: this.props.observableDimensions.isPortrait
              ? ls(16)
              : xls(16),
          },
        ]}>
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
    marginTop: ss(42),
  },
});
