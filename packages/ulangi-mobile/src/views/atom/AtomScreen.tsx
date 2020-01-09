/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomScreen,
  ObservableDarkModeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';

import { AtomScreenIds } from '../../constants/ids/AtomScreenIds';
import { AtomScreenDelegate } from '../../delegates/atom/AtomScreenDelegate';
import { SelectedCategories } from '../../views/category/SelectedCategories';
import { DefaultText } from '../common/DefaultText';
import { AtomMenu } from './AtomMenu';
import {
  AtomScreenStyles,
  darkStyles,
  lightStyles,
  selectedCategoriesDarkStyles,
  selectedCategoriesLightStyles,
} from './AtomScreen.style';
import { AtomTitle } from './AtomTitle';
import { AtomTopBar } from './AtomTopBar';

export interface AtomScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableAtomScreen;
  screenDelegate: AtomScreenDelegate;
}

@observer
export class AtomScreen extends React.Component<AtomScreenProps> {
  public get styles(): AtomScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView style={this.styles.screen} testID={AtomScreenIds.SCREEN}>
        <View style={this.styles.top_bar_container}>
          <AtomTopBar
            iconTestID={AtomScreenIds.BACK_BTN}
            iconType="back"
            onPress={this.props.screenDelegate.back}
          />
        </View>
        <View style={this.styles.middle_container}>
          <View style={this.styles.title_container}>
            <AtomTitle />
          </View>
          <View style={this.styles.menu_container}>
            <AtomMenu
              start={this.props.screenDelegate.startGame}
              goToTutorial={this.props.screenDelegate.goToTutorial}
            />
          </View>
          <View style={this.styles.selected_categories_container}>
            <SelectedCategories
              selectedCategoryNames={
                this.props.observableScreen.selectedCategoryNames
              }
              showSelectSpecificCategoryMessage={
                this.props.screenDelegate.showSelectSpecificCategoryMessage
              }
              theme={this.props.darkModeStore.theme}
              styles={{
                light: selectedCategoriesLightStyles,
                dark: selectedCategoriesDarkStyles,
              }}
            />
          </View>
        </View>
        <View style={this.styles.bottom_container}>
          <DefaultText style={this.styles.note}>
            Note: This game is more fun when you have a lot of vocabulary terms
            to practice.
          </DefaultText>
        </View>
      </SafeAreaView>
    );
  }
}
