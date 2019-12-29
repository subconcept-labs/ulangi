/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDarkModeStore,
  ObservableQuizScreen,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { QuizScreenIds } from '../../constants/ids/QuizScreenIds';
import { QuizScreenDelegate } from '../../delegates/quiz/QuizScreenDelegate';
import { SelectedCategories } from '../category/SelectedCategories';
import { QuizMenu } from './QuizMenu';
import { QuizTitle } from './QuizTitle';

export interface QuizScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableQuizScreen;
  screenDelegate: QuizScreenDelegate;
}

export class QuizScreen extends React.Component<QuizScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={QuizScreenIds.SCREEN}>
        <View style={styles.container}>
          <View style={styles.middle_container}>
            <View style={styles.title_container}>
              <QuizTitle theme={this.props.darkModeStore.theme} />
            </View>
            <View style={styles.menu_container}>
              <QuizMenu
                startWritingQuiz={this.props.screenDelegate.startWritingQuiz}
                startMultipleChoiceQuiz={
                  this.props.screenDelegate.startMultipleChoiceQuiz
                }
                showSettings={this.props.screenDelegate.showSettings}
              />
            </View>
            <View style={styles.selected_categories_container}>
              <SelectedCategories
                selectedCategoryNames={
                  this.props.observableScreen.selectedCategoryNames
                }
                showSelectSpecificCategoryMessage={
                  this.props.screenDelegate.showSelectSpecificCategoryMessage
                }
                theme={this.props.darkModeStore.theme}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  middle_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title_container: {
    alignSelf: 'stretch',
    marginTop: -50,
  },

  menu_container: {
    alignSelf: 'stretch',
  },

  selected_categories_container: {
    marginTop: 50,
  },
});
