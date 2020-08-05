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
import { View } from 'react-native';

import { CreateFirstSetScreenIds } from '../../constants/ids/CreateFirstSetScreenIds';
import { CreateFirstSetScreenDelegate } from '../../delegates/set/CreateFirstSetScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import {
  CreateFirstSetScreenStyles,
  createFirstSetScreenResponsiveStyles,
} from './CreateFirstSetScreen.style';
import { SimpleLanguagePicker } from './SimpleLanguagePicker';

export interface CreateFirstSetScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableAddEditSetScreen;
  screenDelegate: CreateFirstSetScreenDelegate;
}

@observer
export class CreateFirstSetScreen extends React.Component<
  CreateFirstSetScreenProps
> {
  private get styles(): CreateFirstSetScreenStyles {
    return createFirstSetScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={CreateFirstSetScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={false}>
        {this.renderTitle()}
        {this.renderPicker()}
      </Screen>
    );
  }

  private renderTitle(): React.ReactElement<any> {
    return (
      <View style={this.styles.title_container}>
        <DefaultText style={this.styles.title_text}>
          What do you want to learn?
        </DefaultText>
      </View>
    );
  }

  private renderPicker(): React.ReactElement<any> {
    return (
      <SimpleLanguagePicker
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        onSelect={this.props.screenDelegate.handleLanguageSelect}
        languages={this.props.observableScreen.setFormState.selectableLanguagesForCurrentPicker.filter(
          (language): boolean => language.languageCode !== 'any',
        )}
        disabled={this.props.observableScreen.setFormState.pickerState.disabled}
      />
    );
  }
}
