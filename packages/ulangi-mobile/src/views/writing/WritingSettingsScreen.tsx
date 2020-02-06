/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableThemeStore,
  ObservableWritingSettingsScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { config } from '../../constants/config';
import { WritingSettingsScreenIds } from '../../constants/ids/WritingSettingsScreenIds';
import { WritingSettingsScreenDelegate } from '../../delegates/writing/WritingSettingsScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  WritingSettingsScreenStyles,
  darkStyles,
  lightStyles,
  sectionRowDarkStyles,
  sectionRowLightStyles,
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
  public get styles(): WritingSettingsScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        style={this.styles.screen}
        contentContainerStyle={this.styles.content_container}
        testID={WritingSettingsScreenIds.SCREEN}>
        {this.renderSections()}
      </ScrollView>
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
        header="LESSON SETTINGS"
        key="lesson-settings">
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Lesson Size"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.LIMIT_BTN}
              text={this.props.observableScreen.selectedLimit.toString()}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
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
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
          description={this.renderLimitDescription()}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Feedback Buttons"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.FEEDBACK_BUTTONS_BTN}
              text={
                this.props.observableScreen.selectedFeedbackButtons + ' buttons'
              }
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
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
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Autoplay Audio"
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.AUTOPLAY_AUDIO_BTN}
              text={
                this.props.observableScreen.selectedAutoplayAudio ? 'Yes' : 'No'
              }
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
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
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
      </SectionGroup>
    );
  }

  private renderSpacedRepetitionFactorsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        header="SPACED REPETITION FACTORS"
        key="spaced-repetition-factors">
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Initial Interval"
          description={this.renderInitialIntervalDescription()}
          customRight={
            <DefaultButton
              testID={WritingSettingsScreenIds.INITIAL_INTERVAL_BTN}
              text={
                this.props.observableScreen.selectedInitialInterval.toString() +
                ' hours'
              }
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
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
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
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
}
