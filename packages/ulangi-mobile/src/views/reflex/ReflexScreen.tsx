/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReflexScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';

import { ReflexScreenIds } from '../../constants/ids/ReflexScreenIds';
import { ReflexScreenDelegate } from '../../delegates/reflex/ReflexScreenDelegate';
import { SelectedCategories } from '../../views/category/SelectedCategories';
import { ReflexAnswerButtons } from './ReflexAnswerButtons';
import { ReflexGameStats } from './ReflexGameStats';
import { ReflexQuestionBox } from './ReflexQuestionBox';
import {
  ReflexScreenStyles,
  darkStyles,
  lightStyles,
  selectedCategoriesDarkStyles,
  selectedCategoriesLightStyles,
} from './ReflexScreen.style';
import { ReflexTopBar } from './ReflexTopBar';

export interface ReflexScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableReflexScreen;
  screenDelegate: ReflexScreenDelegate;
}

@observer
export class ReflexScreen extends React.Component<ReflexScreenProps> {
  public get styles(): ReflexScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView style={this.styles.screen} testID={ReflexScreenIds.SCREEN}>
        <View style={this.styles.container}>
          <ReflexTopBar
            onIconPressed={this.props.screenDelegate.handleIconPressed}
            gameState={this.props.observableScreen.gameState}
          />
          <ReflexQuestionBox
            gameState={this.props.observableScreen.gameState}
          />
          {!this.props.observableScreen.gameState.started ? (
            <View style={this.styles.selected_categories_container}>
              <SelectedCategories
                selectedCategoryNames={
                  this.props.observableScreen.selectedCategoryNames
                }
                showSelectSpecificCategoryMessage={
                  this.props.screenDelegate.showSelectSpecificCategoryMessage
                }
                theme={this.props.themeStore.theme}
                styles={{
                  light: selectedCategoriesLightStyles,
                  dark: selectedCategoriesDarkStyles,
                }}
              />
            </View>
          ) : (
            <ReflexGameStats
              gameStats={this.props.observableScreen.gameStats}
            />
          )}
          <ReflexAnswerButtons
            gameState={this.props.observableScreen.gameState}
            startGame={this.props.screenDelegate.startGame}
            onAnswerPressed={this.props.screenDelegate.handleSelectAnswer}
          />
        </View>
      </SafeAreaView>
    );
  }
}
