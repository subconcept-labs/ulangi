/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAddEditSetScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { CreateFirstSetScreenIds } from '../../constants/ids/CreateFirstSetScreenIds';
import { CreateFirstSetScreenDelegate } from '../../delegates/set/CreateFirstSetScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { SimpleLanguagePicker } from './SimpleLanguagePicker';

export interface CreateFirstSetScreenProps {
  observableScreen: ObservableAddEditSetScreen;
  screenDelegate: CreateFirstSetScreenDelegate;
}

@observer
export class CreateFirstSetScreen extends React.Component<
  CreateFirstSetScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={CreateFirstSetScreenIds.SCREEN}>
        {this.renderTitle()}
        {this.renderPicker()}
      </View>
    );
  }

  private renderTitle(): React.ReactElement<any> {
    return (
      <View style={styles.title_container}>
        <DefaultText style={styles.title_text}>
          What do you want to learn?
        </DefaultText>
      </View>
    );
  }

  private renderPicker(): React.ReactElement<any> {
    return (
      <SimpleLanguagePicker
        onSelect={this.props.screenDelegate.handleLanguageSelect}
        languages={this.props.observableScreen.setFormState.selectableLanguagesForCurrentPicker.filter(
          (language): boolean => language.languageCode !== 'any',
        )}
        disabled={this.props.observableScreen.setFormState.pickerState.disabled}
      />
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  title_container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  title_text: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
