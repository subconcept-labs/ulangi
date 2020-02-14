/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableQuizSettingsScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { config } from '../../constants/config';
import { QuizSettingsScreenIds } from '../../constants/ids/QuizSettingsScreenIds';
import { QuizSettingsScreenDelegate } from '../../delegates/quiz/QuizSettingsScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  QuizSettingsScreenStyles,
  darkStyles,
  lightStyles,
  sectionRowDarkStyles,
  sectionRowLightStyles,
} from './QuizSettingsScreen.style';

export interface QuizSettingsScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableQuizSettingsScreen;
  screenDelegate: QuizSettingsScreenDelegate;
}

@observer
export class QuizSettingsScreen extends React.Component<
  QuizSettingsScreenProps
> {
  public get styles(): QuizSettingsScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        testID={QuizSettingsScreenIds.SCREEN}
        style={this.styles.screen}
        contentContainerStyle={this.styles.content_container}>
        {this.renderSections()}
      </ScrollView>
    );
  }

  private renderSections(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.renderQuizSettingsSection()}
        {this.renderMultipleChoiceQuizSection()}
        {this.renderWritingQuizSection()}
      </React.Fragment>
    );
  }

  private renderQuizSettingsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        key="quiz-settings"
        header="QUIZ SETTINGS">
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Vocabulary Pool"
          description="Specify to test only learned terms or all active ones."
          customRight={
            <DefaultButton
              testID={QuizSettingsScreenIds.VOCABULARY_POOL_BTN}
              text={_.upperFirst(
                this.props.observableScreen.selectedVocabularyPool,
              )}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showVocabularyPoolMenu(
                  this.getVocabularyPoolValuePairs(),
                  this.props.observableScreen.selectedVocabularyPool,
                  (vocabularyPool): void => {
                    this.props.observableScreen.selectedVocabularyPool = vocabularyPool;
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

  private renderMultipleChoiceQuizSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        key="multiple-choice-quiz"
        header="MULTIPLE CHOICE QUIZ">
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Quiz Size"
          shrink="left"
          description="Number of questions per multiple choice quiz"
          customRight={
            <DefaultButton
              testID={QuizSettingsScreenIds.MULTIPLE_CHOICE_QUIZ_LIMIT_BTN}
              text={this.props.observableScreen.selectedMultipleChoiceQuizLimit.toString()}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showMultipleChoiceQuizLimitMenu(
                  this.getMultipleChoiceQuizLimitValuePairs(),
                  this.props.observableScreen.selectedMultipleChoiceQuizLimit,
                  (limit): void => {
                    this.props.observableScreen.selectedMultipleChoiceQuizLimit = limit;
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

  private renderWritingQuizSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        key="writing-quiz"
        header="WRITING QUIZ">
        <SectionRow
          theme={this.props.themeStore.theme}
          leftText="Quiz Size"
          description="Number of questions per writing quiz"
          shrink="left"
          customRight={
            <DefaultButton
              testID={QuizSettingsScreenIds.WRITING_QUIZ_LIMIT_BTN}
              text={this.props.observableScreen.selectedWritingQuizLimit.toString()}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
              )}
              onPress={(): void => {
                this.props.screenDelegate.showWritingQuizLimitMenu(
                  this.getWritingQuizLimitValuePairs(),
                  this.props.observableScreen.selectedWritingQuizLimit,
                  (limit): void => {
                    this.props.observableScreen.selectedWritingQuizLimit = limit;
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

  private getMultipleChoiceQuizLimitValuePairs(): readonly [number, string][] {
    return config.quiz.selectableMultipleChoiceQuizLimits.map(function(
      limit,
    ): [number, string] {
      return [limit, limit.toString()];
    });
  }

  private getWritingQuizLimitValuePairs(): readonly [number, string][] {
    return config.quiz.selectableWritingQuizLimits.map(function(
      limit,
    ): [number, string] {
      return [limit, limit.toString()];
    });
  }

  private getVocabularyPoolValuePairs(): readonly [
    'learned' | 'active',
    string
  ][] {
    return config.quiz.selectableVocabularyPool.map(function(
      vocabularyPool,
    ): ['learned' | 'active', string] {
      return [vocabularyPool, _.upperFirst(vocabularyPool)];
    });
  }
}
