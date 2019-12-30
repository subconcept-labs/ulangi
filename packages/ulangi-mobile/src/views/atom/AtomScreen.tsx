/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableAtomScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { AtomScreenIds } from '../../constants/ids/AtomScreenIds';
import { AtomScreenDelegate } from '../../delegates/atom/AtomScreenDelegate';
import { SelectedCategories } from '../../views/category/SelectedCategories';
import { DefaultText } from '../common/DefaultText';
import { AtomMenu } from './AtomMenu';
import { AtomTitle } from './AtomTitle';
import { AtomTopBar } from './AtomTopBar';

export interface AtomScreenProps {
  observableScreen: ObservableAtomScreen;
  screenDelegate: AtomScreenDelegate;
}

@observer
export class AtomScreen extends React.Component<AtomScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView style={styles.screen} testID={AtomScreenIds.SCREEN}>
        <View style={styles.top_bar_container}>
          <AtomTopBar
            iconTestID={AtomScreenIds.BACK_BTN}
            iconType="back"
            onPress={this.props.screenDelegate.back}
          />
        </View>
        <View style={styles.middle_container}>
          <View style={styles.title_container}>
            <AtomTitle />
          </View>
          <View style={styles.menu_container}>
            <AtomMenu
              start={this.props.screenDelegate.startGame}
              goToTutorial={this.props.screenDelegate.goToTutorial}
            />
          </View>
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
        </View>
        <View style={styles.bottom_container}>
          <DefaultText style={styles.note}>
            Note: This game is more fun when you have a lot of vocabulary terms
            to practice.
          </DefaultText>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  top_bar_container: {},

  middle_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title_container: {
    alignSelf: 'stretch',
    marginTop: -100,
  },

  menu_container: {
    marginTop: 20,
    alignSelf: 'stretch',
  },

  selected_categories_container: {
    marginTop: 30,
  },

  bottom_container: {
    padding: 16,
  },

  note: {
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
    color: '#1495bc',
  },
});
