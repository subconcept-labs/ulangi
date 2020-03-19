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
import { ScrollView, StyleSheet, View } from 'react-native';

import { AddEditVocabularyScreenDelegate } from '../../delegates/vocabulary/AddEditVocabularyScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { SmartScrollView } from '../common/SmartScrollView';
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
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={this.props.testID}>
        <VocabularyFormTopBar
          theme={this.props.themeStore.theme}
          currentTab={this.props.observableScreen.currentTab}
        />
        {this.props.observableScreen.currentTab.get() === 'Editor'
          ? this.renderEditor()
          : this.renderPreview()}
      </View>
    );
  }

  private renderEditor(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <SmartScrollView
          keyboardShouldPersistTaps="handled"
          keyboardAware={true}
          style={styles.scrollview}>
          <DismissKeyboardView>
            <VocabularyForm
              theme={this.props.themeStore.theme}
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
      <ScrollView contentContainerStyle={styles.preview_container}>
        <VocabularyItem
          theme={this.props.themeStore.theme}
          vocabulary={this.props.screenDelegate.createPreview()}
          shouldShowTags={false}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  scrollview: {
    flex: 1,
  },

  preview_container: {
    flexGrow: 1,
    paddingTop: 16,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
