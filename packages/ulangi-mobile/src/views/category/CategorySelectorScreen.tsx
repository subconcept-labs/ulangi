/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableCategorySelectorScreen,
  ObservableDarkModeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { CategorySelectorScreenIds } from '../../constants/ids/CategorySelectorScreenIds';
import { CategorySelectorScreenDelegate } from '../../delegates/category/CategorySelectorScreenDelegate';
import { CategoryForm } from './CategoryForm';

export interface CategorySelectorScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableScreen: ObservableCategorySelectorScreen;
  screenDelegate: CategorySelectorScreenDelegate;
}

@observer
export class CategorySelectorScreen extends React.Component<
  CategorySelectorScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={CategorySelectorScreenIds.SCREEN}>
        <CategoryForm
          theme={this.props.darkModeStore.theme}
          categoryFormState={this.props.observableScreen.categoryFormState}
          setCategoryName={this.props.screenDelegate.setCategoryName}
          fetchCategorySuggestions={
            this.props.screenDelegate.fetchCategorySuggestions
          }
          showAllCategories={this.props.screenDelegate.showAllCategories}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
