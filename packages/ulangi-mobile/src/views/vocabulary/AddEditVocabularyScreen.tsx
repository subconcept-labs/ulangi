/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableAddEditVocabularyScreen,
  ObservableLanguage,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { AddEditVocabularyScreenDelegate } from '../../delegates/vocabulary/AddEditVocabularyScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { Screen } from '../common/Screen';
import { SmartScrollView } from '../common/SmartScrollView';
import {
  AddEditVocabularyScreenStyles,
  addEditVocabularyScreenResponsiveStyles,
} from './AddEditVocabularyScreen.style';
import { VocabularyForm } from './VocabularyForm';
import { VocabularyFormTopBar } from './VocabularyFormTopBar';
import { VocabularyItem } from './VocabularyItem';

export interface AddEditVocabularyScreenProps {
  testID: string;
  learningLanguage: ObservableLanguage;
  translatedToLanguage: ObservableLanguage;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableAddEditVocabularyScreen;
  screenDelegate: AddEditVocabularyScreenDelegate;
}

@observer
export class AddEditVocabularyScreen extends React.Component<
  AddEditVocabularyScreenProps
> {
  private get styles(): AddEditVocabularyScreenStyles {
    return addEditVocabularyScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={this.props.testID}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <VocabularyFormTopBar
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          currentTab={this.props.observableScreen.currentTab}
        />
        {this.props.observableScreen.currentTab.get() === 'Editor'
          ? this.renderEditor()
          : this.renderPreview()}
      </Screen>
    );
  }

  private renderEditor(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <SmartScrollView
          keyboardShouldPersistTaps="handled"
          keyboardAware={true}
          style={this.styles.scrollview}>
          <DismissKeyboardView>
            <VocabularyForm
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              learningLanguage={this.props.learningLanguage}
              translatedToLanguage={this.props.translatedToLanguage}
              vocabularyFormState={
                this.props.observableScreen.vocabularyFormState
              }
              lookUp={this.props.screenDelegate.lookUp}
              showSuggestions={this.props.screenDelegate.showSuggestions}
              showVocabularyExtraFieldsPicker={
                this.props.screenDelegate.showVocabularyExtraFieldsPicker
              }
              showDefinitionExtraFieldsPicker={
                this.props.screenDelegate.showDefinitionExtraFieldsPicker
              }
              editCategory={this.props.screenDelegate.editCategory}
              addDefinitionSlot={this.props.screenDelegate.addDefinitionSlot}
              deleteDefinition={this.props.screenDelegate.deleteDefinition}
            />
          </DismissKeyboardView>
        </SmartScrollView>
      </React.Fragment>
    );
  }

  private renderPreview(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={this.styles.preview_container}>
        <VocabularyItem
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          vocabulary={this.props.screenDelegate.createPreview()}
          shouldShowTags={false}
        />
      </ScrollView>
    );
  }
}
