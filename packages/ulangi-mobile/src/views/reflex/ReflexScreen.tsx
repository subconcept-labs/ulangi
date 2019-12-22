/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableReflexScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ReflexScreenIds } from '../../constants/ids/ReflexScreenIds';
import { ReflexScreenDelegate } from '../../delegates/reflex/ReflexScreenDelegate';
import { SelectedCategories } from '../../views/category/SelectedCategories';
import { ReflexAnswerButtons } from './ReflexAnswerButtons';
import { ReflexGameStats } from './ReflexGameStats';
import { ReflexQuestionBox } from './ReflexQuestionBox';
import { ReflexTopBar } from './ReflexTopBar';

export interface ReflexScreenProps {
  observableScreen: ObservableReflexScreen;
  screenDelegate: ReflexScreenDelegate;
}

@observer
export class ReflexScreen extends React.Component<ReflexScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={ReflexScreenIds.SCREEN}>
        <View style={styles.container}>
          <ReflexTopBar
            onIconPressed={this.props.screenDelegate.handleIconPressed}
            gameState={this.props.observableScreen.gameState}
          />
          <ReflexQuestionBox
            gameState={this.props.observableScreen.gameState}
          />
          {!this.props.observableScreen.gameState.started ? (
            <View style={styles.selected_categories_container}>
              <SelectedCategories
                selectedCategoryNames={
                  this.props.observableScreen.selectedCategoryNames
                }
                showSelectSpecificCategoryMessage={
                  this.props.screenDelegate.showSelectSpecificCategoryMessage
                }
                theme={Theme.DARK}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  selected_categories_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
