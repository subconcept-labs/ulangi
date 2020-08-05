/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableSetStore,
  ObservableSpacedRepetitionLessonScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { SpacedRepetitionLessonScreenIds } from '../../constants/ids/SpacedRepetitionLessonScreenIds';
import { SpacedRepetitionLessonScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionLessonScreenDelegate';
import { Screen } from '../common/Screen';
import { ReviewBottom } from './ReviewBottom';
import { ReviewItem } from './ReviewItem';
import { ReviewTop } from './ReviewTop';
import {
  SpacedRepetitionLessonScreenStyles,
  spacedRepetitionLessonScreenResponsiveStyles,
} from './SpacedRepetitionLessonScreen.style';
import { SpacedRepetitionResult } from './SpacedRepetitionResult';

export interface SpacedRepetitionLessonScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSpacedRepetitionLessonScreen;
  screenDelegate: SpacedRepetitionLessonScreenDelegate;
}

@observer
export class SpacedRepetitionLessonScreen extends React.Component<
  SpacedRepetitionLessonScreenProps
> {
  public get styles(): SpacedRepetitionLessonScreenStyles {
    return spacedRepetitionLessonScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={SpacedRepetitionLessonScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        {this.renderContent()}
      </Screen>
    );
  }

  private renderContent(): React.ReactElement<any> {
    if (this.props.observableScreen.shouldShowResult.get() === true) {
      return (
        <ScrollView contentContainerStyle={this.styles.container}>
          <SpacedRepetitionResult
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            feedbackListState={this.props.observableScreen.feedbackListState}
            saveState={this.props.observableScreen.saveState}
            shouldShowAdOrGoogleConsentForm={
              this.props.observableScreen.shouldShowAdOrGoogleConsentForm
            }
            showReviewFeedback={this.props.screenDelegate.showReviewFeedback}
            takeAnotherLesson={this.props.screenDelegate.takeAnotherLesson}
            quit={this.props.screenDelegate.showAdIfRequiredThenQuit}
            upgradeToPremium={this.props.screenDelegate.goToAccountTypeScreen}
          />
        </ScrollView>
      );
    } else {
      const currentSet = this.props.setStore.existingCurrentSet;
      return (
        <React.Fragment>
          <ScrollView contentContainerStyle={this.styles.container}>
            <ReviewTop
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              reviewState={this.props.observableScreen.reviewState}
            />
            <ReviewItem
              key={
                this.props.observableScreen.reviewState.vocabulary.vocabularyId
              }
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              learningLanguageCode={currentSet.learningLanguageCode}
              reviewState={this.props.observableScreen.reviewState}
            />
          </ScrollView>
          <ReviewBottom
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
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
