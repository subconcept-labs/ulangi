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
import { QuizMultipleChoiceSettings } from './QuizMultipleChoiceSettings';
import {
  QuizSettingsScreenStyles,
  darkStyles,
  lightStyles,
  sectionRowDarkStyles,
  sectionRowLightStyles,
} from './QuizSettingsScreen.style';
import { QuizWritingSettings } from './QuizWritingSettings';

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
        <QuizMultipleChoiceSettings
          theme={this.props.themeStore.theme}
          multipleChoiceSettings={
            this.props.observableScreen.multipleChoiceSettings
          }
          showMultipleChoiceQuizSizeMenu={
            this.props.screenDelegate.showMultipleChoiceQuizSizeMenu
          }
        />
        <QuizWritingSettings
          theme={this.props.themeStore.theme}
          writingSettings={this.props.observableScreen.writingSettings}
          showWritingQuizSizeMenu={
            this.props.screenDelegate.showWritingQuizSizeMenu
          }
          showWritingAutoShowKeyboardMenu={
            this.props.screenDelegate.showWritingAutoShowKeyboardMenu
          }
        />
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
