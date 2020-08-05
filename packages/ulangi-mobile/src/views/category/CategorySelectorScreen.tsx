/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableCategorySelectorScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { CategorySelectorScreenIds } from '../../constants/ids/CategorySelectorScreenIds';
import { CategorySelectorScreenDelegate } from '../../delegates/category/CategorySelectorScreenDelegate';
import { Screen } from '../common/Screen';
import { CategoryForm } from './CategoryForm';

export interface CategorySelectorScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableCategorySelectorScreen;
  screenDelegate: CategorySelectorScreenDelegate;
}

@observer
export class CategorySelectorScreen extends React.Component<
  CategorySelectorScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={styles.screen}
        testID={CategorySelectorScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <CategoryForm
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          categoryFormState={this.props.observableScreen.categoryFormState}
          handleInputChange={this.props.screenDelegate.handleInputChange}
          selectCategory={this.props.screenDelegate.selectCategory}
          fetchCategorySuggestions={
            this.props.screenDelegate.fetchCategorySuggestions
          }
          clear={this.props.screenDelegate.clear}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
