/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSpacedRepetitionLessonScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import { SpacedRepetitionLessonScreenIds } from '../../constants/ids/SpacedRepetitionLessonScreenIds';
import { SpacedRepetitionLessonScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionLessonScreenDelegate';
import { ReviewBottom } from './ReviewBottom';
import { ReviewItem } from './ReviewItem';
import { ReviewTop } from './ReviewTop';
import {
  SpacedRepetitionLessonScreenStyles,
  darkStyles,
  lightStyles,
} from './SpacedRepetitionLessonScreen.style';
import { SpacedRepetitionResult } from './SpacedRepetitionResult';

export interface SpacedRepetitionLessonScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSpacedRepetitionLessonScreen;
  screenDelegate: SpacedRepetitionLessonScreenDelegate;
}

@observer
export class SpacedRepetitionLessonScreen extends React.Component<
  SpacedRepetitionLessonScreenProps
> {
  public get styles(): SpacedRepetitionLessonScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView
        style={this.styles.screen}
        testID={SpacedRepetitionLessonScreenIds.SCREEN}>
        {this.renderContent()}
      </SafeAreaView>
    );
  }

  private renderContent(): React.ReactElement<any> {
    if (this.props.observableScreen.shouldShowResult.get() === true) {
      return (
        <ScrollView contentContainerStyle={this.styles.container}>
          <SpacedRepetitionResult
            theme={this.props.themeStore.theme}
            feedbackListState={this.props.observableScreen.feedbackListState}
            saveState={this.props.observableScreen.saveState}
            shouldShowAdOrGoogleConsentForm={
              this.props.observableScreen.shouldShowAdOrGoogleConsentForm
            }
            showReviewFeedback={this.props.screenDelegate.showReviewFeedback}
            takeAnotherLesson={this.props.screenDelegate.takeAnotherLesson}
            quit={this.props.screenDelegate.quit}
          />
        </ScrollView>
      );
    } else {
      return (
        <React.Fragment>
          <ScrollView contentContainerStyle={this.styles.container}>
            <ReviewTop
              theme={this.props.themeStore.theme}
              reviewState={this.props.observableScreen.reviewState}
            />
            <ReviewItem
              theme={this.props.themeStore.theme}
              key={
                this.props.observableScreen.reviewState.vocabulary.vocabularyId
              }
              reviewState={this.props.observableScreen.reviewState}
            />
          </ScrollView>
          <ReviewBottom
            theme={this.props.themeStore.theme}
            reviewState={this.props.observableScreen.reviewState}
            reviewActionBarState={
              this.props.observableScreen.reviewActionBarState
            }
            reviewFeedbackBarState={
              this.props.observableScreen.reviewFeedbackBarState
            }
            next={this.props.screenDelegate.nextItem}
            showAnswer={this.props.screenDelegate.showAnswer}
            setFeedback={this.props.screenDelegate.setFeedback}
          />
        </React.Fragment>
      );
    }
  }
}
