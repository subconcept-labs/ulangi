/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
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
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import { QuizMultipleChoiceSettings } from './QuizMultipleChoiceSettings';
import {
  QuizSettingsScreenStyles,
  quizSettingsScreenResponsiveStyles,
  sectionRowResponsiveStyles,
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
    return quizSettingsScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={QuizSettingsScreenIds.SCREEN}
        style={this.styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <ScrollView contentContainerStyle={this.styles.content_container}>
          {this.renderSections()}
        </ScrollView>
      </Screen>
    );
  }

  private renderSections(): React.ReactElement<any> {
    return (
      <React.Fragment>
        {this.renderQuizSettingsSection()}
        <QuizMultipleChoiceSettings
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          multipleChoiceSettings={
            this.props.observableScreen.multipleChoiceSettings
          }
          showMultipleChoiceQuizSizeMenu={
            this.props.screenDelegate.showMultipleChoiceQuizSizeMenu
          }
        />
        <QuizWritingSettings
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          writingSettings={this.props.observableScreen.writingSettings}
          showWritingQuizSizeMenu={
            this.props.screenDelegate.showWritingQuizSizeMenu
          }
        />
      </React.Fragment>
    );
  }

  private renderQuizSettingsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        key="quiz-settings"
        header="QUIZ SETTINGS">
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Vocabulary Pool"
          description="Specify to test only learned terms or all active ones."
          customRight={
            <DefaultButton
              testID={QuizSettingsScreenIds.VOCABULARY_POOL_BTN}
              text={_.upperFirst(
                this.props.observableScreen.selectedVocabularyPool,
              )}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
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
          styles={sectionRowResponsiveStyles}
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
