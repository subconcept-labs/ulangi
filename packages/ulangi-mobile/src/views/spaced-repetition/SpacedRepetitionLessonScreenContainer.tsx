/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableFeedbackListState,
  ObservableReviewActionBarState,
  ObservableReviewFeedbackBarState,
  ObservableReviewState,
  ObservableSpacedRepetitionLessonScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { ObservableMap, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { SpacedRepetitionLessonScreenIds } from '../../constants/ids/SpacedRepetitionLessonScreenIds';
import { SpacedRepetitionLessonScreenFactory } from '../../factories/spaced-repetition/SpacedRepetitionLessonScreenFactory';
import { ReviewIterator } from '../../iterators/ReviewIterator';
import { SpacedRepetitionLessonScreen } from './SpacedRepetitionLessonScreen';
import { SpacedRepetitionLessonScreenStyle } from './SpacedRepetitionLessonScreenContainer.style';

export interface SpacedReptitionLessonScreenPassedProps {
  readonly vocabularyList: ObservableMap<string, ObservableVocabulary>;
  readonly startLesson: () => void;
}

@observer
export class SpacedRepetitionLessonScreenContainer extends Container<
  SpacedReptitionLessonScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SpacedRepetitionLessonScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SpacedRepetitionLessonScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SpacedRepetitionLessonScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private spacedRepetitionSettingsDelegate = this.screenFactory.createSpacedRepetitionSettingsDelegate();

  private currentSettings = this.spacedRepetitionSettingsDelegate.getCurrentSettings();

  private reviewIterator = new ReviewIterator(
    this.props.passedProps.vocabularyList,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected observableScreen = new ObservableSpacedRepetitionLessonScreen(
    this.props.passedProps.vocabularyList,
    new ObservableReviewState(
      this.currentSettings.reviewStrategy,
      this.reviewIterator.next(),
      false,
      0,
      this.reviewIterator.getSize(),
      false,
    ),
    new ObservableReviewActionBarState(observable.array([])),
    new ObservableReviewFeedbackBarState(
      observable.map(),
      'SHOW_ANSWER_BUTTON',
    ),
    new ObservableFeedbackListState(observable.map()),
    observable.box(this.currentSettings.feedbackButtons),
    observable.box(ActivityState.INACTIVE),
    observable.box(ActivityState.INACTIVE),
    observable.box(false),
    observable.box(false),
    ScreenName.SPACED_REPETITION_LESSON_SCREEN,
    new ObservableTitleTopBar(
      'Spaced Repetition',
      new ObservableTopBarButton(
        SpacedRepetitionLessonScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.back();
        },
      ),
      null,
    ),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
    this.reviewIterator,
    this.props.passedProps.startLesson,
  );

  private back(): void {
    if (this.observableScreen.shouldShowAdOrGoogleConsentForm.get()) {
      this.screenDelegate.showAdOrGoogleConsentForm(
        (): void => this.navigatorDelegate.pop(),
      );
    } else if (this.observableScreen.saveState.get() === ActivityState.ACTIVE) {
      this.screenDelegate.showSavingInProgressDialog();
    } else if (this.observableScreen.shouldShowResult.get() === false) {
      this.screenDelegate.showConfirmQuitLessonDialog();
    } else {
      this.navigatorDelegate.pop();
    }
  }

  public componentDidMount(): void {
    this.screenDelegate.setUpButtons();
    this.screenDelegate.autoUpdateButtons();
    this.screenDelegate.autoDisablePopGestureWhenAdRequiredToShow();
    this.screenDelegate.addBackButtonHandler(
      this.screenDelegate.handleBackButton,
    );

    if (this.screenDelegate.shouldLoadAd()) {
      this.screenDelegate.loadAd();
    }
  }

  public componentWillUnmount(): void {
    this.screenDelegate.removeBackButtonHandler(
      this.screenDelegate.handleBackButton,
    );
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SpacedRepetitionLessonScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SpacedRepetitionLessonScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SpacedRepetitionLessonScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
