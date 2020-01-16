/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableAddEditSetScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { AddEditSetScreenDelegate } from '../../delegates/set/AddEditSetScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { LanguagePicker } from './LanguagePicker';
import { SetForm } from './SetForm';

export interface AddEditSetScreenProps {
  testID: string;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableAddEditSetScreen;
  screenDelegate: AddEditSetScreenDelegate;
}

@observer
export class AddEditSetScreen extends React.Component<AddEditSetScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <DismissKeyboardView testID={this.props.testID} style={styles.screen}>
        <SetForm
          theme={this.props.themeStore.theme}
          setFormState={this.props.observableScreen.setFormState}
          showSelectLearningLanguageFirstDialog={
            this.props.screenDelegate.showSelectLearningLanguageFirstDialog
          }
          showPicker={this.props.screenDelegate.showPicker}
        />
        {this.props.observableScreen.setFormState.pickerState.currentPicker !==
        null
          ? this.renderLanguagePicker()
          : null}
      </DismissKeyboardView>
    );
  }

  private renderLanguagePicker(): React.ReactElement<any> {
    return (
      <LanguagePicker
        theme={this.props.themeStore.theme}
        pickerState={this.props.observableScreen.setFormState.pickerState}
        selectedLanguageCode={
          this.props.observableScreen.setFormState
            .selectedLanguageCodeForCurrentPicker
        }
        selectableLanguages={
          this.props.observableScreen.setFormState
            .selectableLanguagesForCurrentPicker
        }
        onLanguageSelect={this.props.screenDelegate.handleLanguageSelected}
        hidePicker={this.props.screenDelegate.hidePicker}
      />
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
