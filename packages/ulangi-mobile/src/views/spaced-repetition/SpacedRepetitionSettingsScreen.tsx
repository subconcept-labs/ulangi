/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableSpacedRepetitionSettingsScreen,
} from '@ulangi/ulangi-observable';
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
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableSpacedRepetitionSettingsScreen;
  screenDelegate: SpacedRepetitionSettingsScreenDelegate;
}

@observer
export class SpacedRepetitionSettingsScreen extends React.Component<
  SpacedRepetitionSettingsScreenProps
> {
  public get styles(): SpacedRepetitionSettingsScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
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
        theme={this.props.darkModeStore.theme}
        header="LESSON SETTINGS"
        key="lesson-settings">
        <SectionRow
          theme={this.props.darkModeStore.theme}
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
      </SectionGroup>
    );
  }

  private renderSpacedRepetitonFactorsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.darkModeStore.theme}
        header="SPACED REPETITION FACTORS"
        key="spaced-repetition-factors">
        <SectionRow
          theme={this.props.darkModeStore.theme}
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

  private getLimitValuePairs(): readonly [number, string][] {
    return config.spacedRepetition.selectableLimits.map(function(
      limit,
    ): [number, string] {
      return [limit, limit.toString()];
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
