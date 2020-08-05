/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableReflexScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { ReflexScreenIds } from '../../constants/ids/ReflexScreenIds';
import { ReflexScreenDelegate } from '../../delegates/reflex/ReflexScreenDelegate';
import { SelectedCategories } from '../../views/category/SelectedCategories';
import { Screen } from '../common/Screen';
import { ReflexAnswerButtons } from './ReflexAnswerButtons';
import { ReflexGameStats } from './ReflexGameStats';
import { ReflexQuestionBox } from './ReflexQuestionBox';
import {
  ReflexScreenStyles,
  reflexScreenResponsiveStyles,
  selectedCategoriesResponsiveStyles,
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
    return reflexScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        useSafeAreaView={true}
        style={this.styles.screen}
        testID={ReflexScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.container}>
          <ReflexTopBar
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            onIconPressed={this.props.screenDelegate.handleIconPressed}
            gameState={this.props.observableScreen.gameState}
          />
          <ReflexQuestionBox
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            gameState={this.props.observableScreen.gameState}
          />
          {!this.props.observableScreen.gameState.started ? (
            <View style={this.styles.selected_categories_container}>
              <SelectedCategories
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                selectedCategoryNames={
                  this.props.observableScreen.selectedCategoryNames
                }
                showSelectSpecificCategoryMessage={
                  this.props.screenDelegate.showSelectSpecificCategoryMessage
                }
                styles={selectedCategoriesResponsiveStyles}
              />
            </View>
          ) : (
            <ReflexGameStats
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              gameStats={this.props.observableScreen.gameStats}
            />
          )}
          <ReflexAnswerButtons
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            gameState={this.props.observableScreen.gameState}
            startGame={this.props.screenDelegate.startGame}
            onAnswerPressed={this.props.screenDelegate.handleSelectAnswer}
          />
        </View>
      </Screen>
    );
  }
}
