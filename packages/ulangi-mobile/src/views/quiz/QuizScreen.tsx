/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v2.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableQuizScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { QuizScreenIds } from '../../constants/ids/QuizScreenIds';
import { QuizScreenDelegate } from '../../delegates/quiz/QuizScreenDelegate';
import { SelectedCategories } from '../category/SelectedCategories';
import { Screen } from '../common/Screen';
import { QuizMenu } from './QuizMenu';
import {
  QuizScreenStyles,
  quizScreenResponsiveStyles,
} from './QuizScreen.style';
import { QuizTitle } from './QuizTitle';

export interface QuizScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableQuizScreen;
  screenDelegate: QuizScreenDelegate;
}

@observer
export class QuizScreen extends React.Component<QuizScreenProps> {
  private get styles(): QuizScreenStyles {
    return quizScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={QuizScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.container}>
          <View style={this.styles.middle_container}>
            <View style={this.styles.title_container}>
              <QuizTitle
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
              />
            </View>
            <View style={this.styles.menu_container}>
              <QuizMenu
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                startWritingQuiz={this.props.screenDelegate.startWritingQuiz}
                startMultipleChoiceQuiz={
                  this.props.screenDelegate.startMultipleChoiceQuiz
                }
                showSettings={this.props.screenDelegate.showSettings}
              />
            </View>
            <View style={this.styles.selected_categories_container}>
              <SelectedCategories
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                selectedCategoryNames={
                  this.props.observableScreen.selectedCategoryNames
                }
                showSelectSpecificCategoryMessage={
                  this.props.screenDelegate.showSelectSpecificCategoryMessage
                }
              />
            </View>
          </View>
        </View>
      </Screen>
    );
  }
}
