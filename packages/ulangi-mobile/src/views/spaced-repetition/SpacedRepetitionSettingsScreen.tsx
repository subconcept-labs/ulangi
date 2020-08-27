/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ButtonSize,
  ReviewPriority,
  ReviewStrategy,
} from '@ulangi/ulangi-common/enums';
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
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  SpacedRepetitionSettingsScreenStyles,
  sectionRowResponsiveStyles,
  spacedRepetitionSettingsScreenResponsiveStyles,
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
  private get styles(): SpacedRepetitionSettingsScreenStyles {
    return spacedRepetitionSettingsScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}
        testID={SpacedRepetitionSettingsScreenIds.SCREEN}>
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
        {this.renderSpacedRepetitonFactorsSection()}
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
              testID={SpacedRepetitionSettingsScreenIds.LIMIT_BTN}
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
          description={this.renderLimitDescription()}
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Feedback Buttons"
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.FEEDBACK_BUTTONS_BTN}
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
              testID={SpacedRepetitionSettingsScreenIds.AUTOPLAY_AUDIO_BTN}
              text={
                this.props.observableScreen.selectedAutoplayAudio ? 'On' : 'Off'
              }
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => {
                this.props.observableScreen.selectedAutoplayAudio = !this.props
                  .observableScreen.selectedAutoplayAudio;
              }}
            />
          }
          description={this.renderAutoplayAudioDescription()}
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Review Strategy"
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.REVIEW_STRATEGY_BTN}
              text={this.props.observableScreen.selectedReviewStrategy}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
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
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Review Priority"
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.REVIEW_PRIORITY_BTN}
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

  private renderSpacedRepetitonFactorsSection(): React.ReactElement<any> {
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
          customRight={
            <DefaultButton
              testID={SpacedRepetitionSettingsScreenIds.INITIAL_INTERVAL_BTN}
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
          description={this.renderInitialIntervalDescription()}
          styles={sectionRowResponsiveStyles}
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
              {
                'Review only one side; that is, given terms, answer what their definitions are.'
              }
            </DefaultText>
          </DefaultText>
        );
        break;

      case ReviewStrategy.REVERSED:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>Reversed: </DefaultText>
            <DefaultText>
              {
                'Review only one side; that is, given definitions, answer what their terms are.'
              }
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
                  'Allow you to review both sides. It will switch side after reaching half of the level range.\n\n'
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
                {
                  'Allow you to review both sides. It will switch side for you based on level of your cards.\n\n'
                }
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

  private renderReviewPriorityDescription(): React.ReactElement<any> {
    let description: string | Element = '';
    const tip =
      '* Tip: You can start review with new cards first by tapping on the new count on menu screen. Similarly, tap on the due count to review due cards first.';

    switch (this.props.observableScreen.selectedReviewPriority) {
      case ReviewPriority.DUE_TERMS_FIRST:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>
              Due terms first:{' '}
            </DefaultText>
            <DefaultText>
              {'Prioritize due terms over new ones.\n\n'}
            </DefaultText>
            <DefaultText>{tip}</DefaultText>
          </DefaultText>
        );
        break;

      case ReviewPriority.NEW_TERMS_FIRST:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>
              New terms first:{' '}
            </DefaultText>
            <DefaultText>
              {'Prioritize new terms over due ones.\n\n'}
            </DefaultText>
            <DefaultText />
            <DefaultText>{tip}</DefaultText>
          </DefaultText>
        );
        break;

      case ReviewPriority.NO_PRIORITY:
        description = (
          <DefaultText>
            <DefaultText style={this.styles.bold}>No priority: </DefaultText>
            <DefaultText>
              {'Due and new terms will be reviewed equally.\n\n'}
            </DefaultText>
            <DefaultText>
              * Tip: Tap on the due count on menu screen to review due cards
              first. Similarly, tap on the new count to review new cards first.
            </DefaultText>
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
        Number of cards you want to review per lesson.
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

  private renderAutoplayAudioDescription(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.description}>
        Automatically play audio once after showing answer.
      </DefaultText>
    );
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
