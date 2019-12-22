/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDarkModeStore,
  ObservableSpacedRepetitionScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { SpacedRepetitionScreenIds } from '../../constants/ids/SpacedRepetitionScreenIds';
import { SpacedRepetitionScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionScreenDelegate';
import { SelectedCategories } from '../category/SelectedCategories';
import { SpacedRepetitionMenu } from './SpacedRepetitionMenu';
import { SpacedRepetitionTitle } from './SpacedRepetitionTitle';

export interface SpacedRepetitionScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableSpacedRepetitionScreen;
  screenDelegate: SpacedRepetitionScreenDelegate;
}

@observer
export class SpacedRepetitionScreen extends React.Component<
  SpacedRepetitionScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={SpacedRepetitionScreenIds.SCREEN}>
        <View style={styles.container}>
          <View style={styles.middle_container}>
            <View style={styles.title_container}>
              <SpacedRepetitionTitle theme={this.props.darkModeStore.theme} />
            </View>
            <View style={styles.menu_container}>
              <SpacedRepetitionMenu
                startLesson={(): void =>
                  this.props.screenDelegate.startLesson(false)
                }
                showSettings={this.props.screenDelegate.showSettings}
                showFAQ={this.props.screenDelegate.showFAQ}
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
                theme={this.props.darkModeStore.theme}
              />
            </View>
          </View>
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
  },

  middle_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title_container: {
    alignSelf: 'stretch',
    marginTop: -50,
  },

  menu_container: {
    alignSelf: 'stretch',
    marginTop: -50,
  },

  bottom_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },

  note: {
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
    color: '#777',
  },

  highlighted: {
    color: config.styles.primaryColor,
  },

  selected_categories_container: {
    marginTop: 50,
  },
});
