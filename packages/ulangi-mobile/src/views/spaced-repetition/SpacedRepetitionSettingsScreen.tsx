/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, ReviewStrategy, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSpacedRepetitionSettingsScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { config } from '../../constants/config';
import { SpacedRepetitionSettingsScreenIds } from '../../constants/ids/SpacedRepetitionSettingsScreenIds';
import { SpacedRepetitionSettingsScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  SpacedRepetitionSettingsScreenStyles,
  darkStyles,
  lightStyles,
  sectionRowDarkStyles,
  sectionRowLightStyles,
} from './SpacedRepetitionSettingsScreen.style';

export interface SpacedRepetitionSettingsScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSpacedRepetitionSettingsScreen;
  screenDelegate: SpacedRepetitionSettingsScreenDelegate;
}

@observer
export class SpacedRepetitionSettingsScreen extends React.Component<
  SpacedRepetitionSettingsScreenProps
> {
  public get styles(): SpacedRepetitionSettingsScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        style={this.styles.screen}
        contentContainerStyle={this.styles.content_container}
        testID={SpacedRepetitionSettingsScreenIds.SCREEN}>
        {this.renderSections()}
      </ScrollView>
    );
  }

  private renderSections(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.renderLessonSettingsSection()}
        {this.renderSpacedRepetitonFactorsSection()}
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
          leftText="Review Strategy"
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.REVIEW_STRATEGY_BTN}
              text={this.props.observableScreen.selectedReviewStrategy}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showReviewStrategyMenu(
                  this.getReviewStrategyPairs(),
                  this.props.observableScreen.selectedReviewStrategy,
                  (reviewStrategy): void => {
                    this.props.observableScreen.selectedReviewStrategy = reviewStrategy;
                  },
                );
              }}
            />
          }
          description={this.renderReviewStrategyDescription()}
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Lesson Size"
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.LIMIT_BTN}
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
          description={this.renderLimitDescription()}
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Feedback Buttons"
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.FEEDBACK_BUTTONS_BTN}
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
      </SectionGroup>
    );
  }

  private renderSpacedRepetitonFactorsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        header="SPACED REPETITION FACTORS"
        key="spaced-repetition-factors">
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Initial Interval"
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.INITIAL_INTERVAL_BTN}
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
          description={this.renderInitialIntervalDescription()}
          styles={{
            light: sectionRowLightStyles,
            dark: sectionRowDarkStyles,
          }}
        />
      </SectionGroup>
    );
  }

  private renderReviewStrategyDescription(): React.ReactElement<any> {
    let description: string | Element = '';
    switch (this.props.observableScreen.selectedReviewStrategy) {
      case ReviewStrategy.FORWARD:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>Forward: </DefaultText>
            <DefaultText>
              {'Given terms, answer what their definitions are.'}
            </DefaultText>
          </DefaultText>
        );
        break;

      case ReviewStrategy.REVERSED:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>Reversed: </DefaultText>
            <DefaultText>
              {'Given definitions, answer what their terms are.'}
            </DefaultText>
          </DefaultText>
        );
        break;

      case ReviewStrategy.HALF_AND_HALF:
        description = (
          <DefaultText>
            <DefaultText>
              <DefaultText style={this.styles.bold}>
                Half-and-half:{' '}
              </DefaultText>
              <DefaultText>
                {
                  'Switch review direction after reaching half of the level range.\n\n'
                }
              </DefaultText>
            </DefaultText>
            <DefaultText>{'- Level 0 - 4: Forward\n'}</DefaultText>
            <DefaultText>{'- Level 5 - 9: Reversed'}</DefaultText>
          </DefaultText>
        );
        break;

      case ReviewStrategy.ALTERNATING:
        description = (
          <DefaultText>
            <DefaultText>
              <DefaultText style={this.styles.bold}>Alternating: </DefaultText>
              <DefaultText>
                {'Rotate review direction repeatedly (every 3 levels.)\n\n'}
              </DefaultText>
            </DefaultText>
            <DefaultText>{'- Level 0: Forward\n'}</DefaultText>
            <DefaultText>{'- Level 1 - 3: Reversed\n'}</DefaultText>
            <DefaultText>{'- Level 4 - 6: Forward\n'}</DefaultText>
            <DefaultText>{'- Level 7 - 9: Reversed'}</DefaultText>
          </DefaultText>
        );
        break;
    }

    return (
      <DefaultText style={this.styles.description}>{description}</DefaultText>
    );
  }

  private renderLimitDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Number of terms you want to review per lesson.
      </DefaultText>
    );
  }

  private renderInitialIntervalDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Interval of a term is the time you have to wait to review it again.{' '}
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

  private getReviewStrategyPairs(): readonly [
    ReviewStrategy,
    ReviewStrategy
  ][] {
    return _.values(ReviewStrategy).map(function(
      reviewStrategy,
    ): [ReviewStrategy, ReviewStrategy] {
      return [
        reviewStrategy as ReviewStrategy,
        reviewStrategy as ReviewStrategy,
      ];
    });
  }

  private getLimitValuePairs(): readonly [number, string][] {
    return config.spacedRepetition.selectableLimits.map(function(
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
    return config.spacedRepetition.selectableInitialIntervals.map(function(
      initialInterval,
    ): [number, string] {
      return [initialInterval, initialInterval + ' hours'];
    });
  }
}
