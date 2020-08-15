/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, ReviewPriority } from '@ulangi/ulangi-common/enums';
import {
  ObservableThemeStore,
  ObservableWritingSettingsScreen,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { config } from '../../constants/config';
import { WritingSettingsScreenIds } from '../../constants/ids/WritingSettingsScreenIds';
import { WritingSettingsScreenDelegate } from '../../delegates/writing/WritingSettingsScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  WritingSettingsScreenStyles,
  sectionRowResponsiveStyles,
  writingSettingsScreenResponsiveStyles,
} from './WritingSettingsScreen.style';

export interface WritingSettingsScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableWritingSettingsScreen;
  screenDelegate: WritingSettingsScreenDelegate;
}

@observer
export class WritingSettingsScreen extends React.Component<
  WritingSettingsScreenProps
> {
  private get styles(): WritingSettingsScreenStyles {
    return writingSettingsScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={WritingSettingsScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <ScrollView contentContainerStyle={this.styles.content_container}>
          {this.renderSections()}
        </ScrollView>
      </Screen>
    );
  }

  private renderSections(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.renderLessonSettingsSection()}
        {this.renderSpacedRepetitionFactorsSection()}
      </React.Fragment>
    );
  }

  private renderLessonSettingsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        header="LESSON SETTINGS"
        key="lesson-settings">
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Lesson Size"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.LIMIT_BTN}
              text={this.props.observableScreen.selectedLimit.toString()}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showLimitMenu(
                  this.getLimitValuePairs(),
                  this.props.observableScreen.selectedLimit,
                  (limit): void => {
                    this.props.observableScreen.selectedLimit = limit;
                  },
                );
              }}
            />
          }
          styles={sectionRowResponsiveStyles}
          description={this.renderLimitDescription()}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Feedback Buttons"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.FEEDBACK_BUTTONS_BTN}
              text={
                this.props.observableScreen.selectedFeedbackButtons + ' buttons'
              }
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showFeedbackButtonsMenu(
                  this.getFeedbackButtonsValuePairs(),
                  this.props.observableScreen.selectedFeedbackButtons,
                  (feedbackButtons): void => {
                    this.props.observableScreen.selectedFeedbackButtons = feedbackButtons;
                  },
                );
              }}
            />
          }
          description={this.renderFeedbackButtonsDescription()}
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Autoplay Audio"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.AUTOPLAY_AUDIO_BTN}
              text={
                this.props.observableScreen.selectedAutoplayAudio ? 'Yes' : 'No'
              }
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showAutoplayAudioMenu(
                  this.getAutoplayAudioValuePairs(),
                  this.props.observableScreen.selectedAutoplayAudio,
                  (autoplayAudio): void => {
                    this.props.observableScreen.selectedAutoplayAudio = autoplayAudio;
                  },
                );
              }}
            />
          }
          description={this.renderAutoplayAudioDescription()}
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Auto-Show Keyboard"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.AUTO_SHOW_KEYBOARD_BTN}
              text={
                this.props.observableScreen.selectedAutoShowKeyboard
                  ? 'Yes'
                  : 'No'
              }
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showAutoShowKeyboardMenu(
                  this.getAutoShowKeyboardValuePairs(),
                  this.props.observableScreen.selectedAutoShowKeyboard,
                  (autoShowKeyboard): void => {
                    this.props.observableScreen.selectedAutoShowKeyboard = autoShowKeyboard;
                  },
                );
              }}
            />
          }
          description={this.renderAutoShowKeyboardDescription()}
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Highlight On Error"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.HIGHLIGHT_ON_ERROR_BTN}
              text={
                this.props.observableScreen.selectedHighlightOnError
                  ? 'On'
                  : 'Off'
              }
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.observableScreen.selectedHighlightOnError = !this
                  .props.observableScreen.selectedHighlightOnError;
              }}
            />
          }
          description={this.renderHighlightOnErrorDescription()}
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Review Priority"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.REVIEW_PRIORITY_BTN}
              text={this.props.observableScreen.selectedReviewPriority}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showReviewPriorityMenu(
                  this.getReviewPriorityPairs(),
                  this.props.observableScreen.selectedReviewPriority,
                  (reviewPriority): void => {
                    this.props.observableScreen.selectedReviewPriority = reviewPriority;
                  },
                );
              }}
            />
          }
          description={this.renderReviewPriorityDescription()}
          styles={sectionRowResponsiveStyles}
        />
      </SectionGroup>
    );
  }

  private renderSpacedRepetitionFactorsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        header="SPACED REPETITION FACTORS"
        key="spaced-repetition-factors">
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Initial Interval"
          description={this.renderInitialIntervalDescription()}
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.INITIAL_INTERVAL_BTN}
              text={
                this.props.observableScreen.selectedInitialInterval.toString() +
                ' hours'
              }
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showInitialIntervalMenu(
                  this.getInitialIntervalValuePairs(),
                  this.props.observableScreen.selectedInitialInterval,
                  (initialInterval): void => {
                    this.props.observableScreen.selectedInitialInterval = initialInterval;
                  },
                );
              }}
            />
          }
          styles={sectionRowResponsiveStyles}
        />
      </SectionGroup>
    );
  }

  private renderLimitDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Number of terms you want to write per lesson.
      </DefaultText>
    );
  }

  private renderInitialIntervalDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Interval of a term is the time you have to wait to write it again.{' '}
        <DefaultText
          style={this.styles.touchable_text}
          onPress={(): void =>
            this.props.screenDelegate.showIntervalsLightBox()
          }>
          Press here{' '}
        </DefaultText>
        to view intervals at each level.
      </DefaultText>
    );
  }

  private renderFeedbackButtonsDescription(): React.ReactElement<any> {
    let text = '';
    switch (this.props.observableScreen.selectedFeedbackButtons) {
      case 3:
        text = `Use 3 feedback buttons: ${this.props.screenDelegate
          .getButtonsToShow(3)
          .join(', ')}`;
        break;

      case 4:
        text = `Use 4 feedback buttons: ${this.props.screenDelegate
          .getButtonsToShow(4)
          .join(', ')}`;
        break;

      case 5:
        text = `Use 5 feedback buttons: ${this.props.screenDelegate
          .getButtonsToShow(5)
          .join(', ')}`;
        break;
    }

    return <DefaultText style={this.styles.description}>{text}</DefaultText>;
  }

  private renderAutoplayAudioDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Automatically play audio once after writing terms correctly.
      </DefaultText>
    );
  }

  private renderAutoShowKeyboardDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Automatically show keyboard for each term.
      </DefaultText>
    );
  }

  private renderHighlightOnErrorDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Highlight on red when you type answer incorrectly.
      </DefaultText>
    );
  }

  private renderReviewPriorityDescription(): React.ReactElement<any> {
    let description: string | Element = '';
    switch (this.props.observableScreen.selectedReviewPriority) {
      case ReviewPriority.DUE_TERMS_FIRST:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>
              Due terms first:{' '}
            </DefaultText>
            <DefaultText>Prioritize due terms over new ones.</DefaultText>
          </DefaultText>
        );
        break;

      case ReviewPriority.NEW_TERMS_FIRST:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>
              New terms first:{' '}
            </DefaultText>
            <DefaultText>Prioritize new terms over due ones.</DefaultText>
          </DefaultText>
        );
        break;

      case ReviewPriority.NO_PRIORITY:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>No priority: </DefaultText>
            <DefaultText>
              Due and new terms will be reviewed equally.
            </DefaultText>
          </DefaultText>
        );
        break;
    }

    return (
      <DefaultText style={this.styles.description}>{description}</DefaultText>
    );
  }

  private getLimitValuePairs(): readonly [number, string][] {
    return config.writing.selectableLimits.map(function(
      limit,
    ): [number, string] {
      return [limit, limit.toString()];
    });
  }

  private getFeedbackButtonsValuePairs(): readonly [3 | 4 | 5, string][] {
    return config.spacedRepetition.selectableFeedbackButtons.map(function(
      feedbackButtons,
    ): [3 | 4 | 5, string] {
      return [feedbackButtons, feedbackButtons + ' buttons'];
    });
  }

  private getInitialIntervalValuePairs(): readonly [number, string][] {
    return config.writing.selectableInitialIntervals.map(function(
      initialInterval,
    ): [number, string] {
      return [initialInterval, initialInterval + ' hours'];
    });
  }

  private getAutoplayAudioValuePairs(): readonly [boolean, string][] {
    return [[true, 'Yes'], [false, 'No']];
  }

  private getAutoShowKeyboardValuePairs(): readonly [boolean, string][] {
    return [[true, 'Yes'], [false, 'No']];
  }

  private getReviewPriorityPairs(): readonly [
    ReviewPriority,
    ReviewPriority
  ][] {
    return _.values(ReviewPriority).map(function(
      reviewPriority,
    ): [ReviewPriority, ReviewPriority] {
      return [
        reviewPriority as ReviewPriority,
        reviewPriority as ReviewPriority,
      ];
    });
  }
}
